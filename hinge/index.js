var qr = require('qr-image');
var dgram = require('dgram');
var net = require('net');
var _ = require('lodash');
var Peer = rootRequire('hinge/peer');
var Device = rootRequire('hinge/device');
var ipc = require('ipc');

function Hinge (opts) {
    this.opts = opts || {};

    // Groupd leader
    this.groupLeader = !!this.opts.groupLeader;

    // broadcast port
    this.broadcastHost = this.opts.broadcastHost || "255.255.255.255";
    this.broadcastPort = this.opts.broadcastPort || 56700;
    this.broadcastInterval = this.opts.broadcastInterval || 1000;
    this.broadcastTimeout = this.opts.broadcastTimeout || 5000;

    // tcp device port
    this.tcpDevicePort = this.opts.tcpDevicePort || 56701;
    // tcp peer port
    this.tcpPeerPort = this.opts.tcpPeerPort || 56702;

    // device
    this.device = null;
    this.peer = null;

    // on mingle callback
    this.onMingle = this.opts.onMingle || _.identity;
    this.onPeerConnect = this.opts.onPeerConnect || _.identity;
    this.onDeviceConnect = this.opts.onDeviceConnect || _.identity;
    this.onDeviceData = this.opts.onDeviceData || _.identity;

    // bind `this`
    this.startMingling = this.startMingling.bind(this);
    this._startMingling = this._startMingling.bind(this);
    this.stopMingling = this.stopMingling.bind(this);
    this.onMingle = this.onMingle.bind(this);
    this.onPeerConnect = this.onPeerConnect.bind(this);
    this.onDeviceConnect = this.onDeviceConnect.bind(this);
    this.onDeviceData = this.onDeviceData.bind(this);
}

Hinge.prototype.constructor = Hinge;
Hinge.prototype.qrCode = function(callback) {
    if (!callback) return;
    require('dns').lookup(require('os').hostname(), function (err, add, fam) {
        console.log(add, this.tcpDevicePort);
        callback(err, qr.imageSync(add + ":" + this.tcpDevicePort, { type: 'svg' }));
    }.bind(this));
}

Hinge.prototype.startMingling = function() {
    this.udpSocket && this.stopMingling();
    this.udpSocket = dgram.createSocket("udp4");
    this.udpSocket.on('listening', function(){
        console.log("Listening on port " + this.broadcastPort);
        this.udpSocket.setBroadcast(true);
    }.bind(this));
    this.udpSocket.on('message', function (message, rinfo) {
        var data = JSON.parse(message.toString());
        if (data.mingle) {
            if (this.groupLeader) {
                data.available = true;
                var m = new Buffer(JSON.stringify(data));
                this.udpSocket.send(m, 0, m.length, rinfo.address, rinfo.port);
            } else if (data.available) {
                this.stopMingling();

                // tcp connection to peer
                this.connect(rinfo.address, rinfo.port);
            }
        }
    }.bind(this));
    this.udpSocket.bind(this.broadcastPort);

    // start mingling
    if (!this.groupLeader) {
        this._startMingling();
    }
    setTimeout(this.stopMingling, this.broadcastTimeout);
}

Hinge.prototype.stopMingling = function(){
    this.udpSocket && this.udpSocket.close();
    this.udpSocket = null;
    clearTimeout(this._startMingling.timeout);
    this.onMingle();
}

Hinge.prototype._startMingling = function(){
    clearTimeout(this._startMingling.timeout);
    if (!this.udpSocket) return;

    // send message
    var message = new Buffer(JSON.stringify({
        _: Date.now(),
        mingle: true,
        peer: true
    }));

    this.udpSocket.send(message, 0, message.length, this.broadcastPort, this.broadcastHost, function(err) {
        this._startMingling.timeout = setTimeout(this._startMingling, this.broadcastInterval);
    }.bind(this));
}

Hinge.prototype.startDeviceServer = function() {
    var hinge = this;

    // Start a TCP Server
    net.createServer(function (socket) {
        var device = this.device = new Device(socket.remoteAddress, socket.remotePort);
        device.socket = socket;
        device.name = socket.remoteAddress + ":" + socket.remotePort;

        // Handle incoming messages from clients.
        socket.on('data', function (data) {
            try{
                console.log( "ipc : " );
                console.log( data.toString() );
                hinge.onDeviceData(JSON.parse(data.toString()));
            }
            catch(err) {
            }
        });

        // Remove the client from the list when it leaves
        socket.on('end', function () {
            device.socket = null;
        });

        // on device connect
        this.onDeviceConnect(device);
    }.bind(this)).listen(this.tcpDevicePort);

    // Put a friendly message on the terminal of the server.
    console.log("Device server running at port " + this.tcpDevicePort + "\n");
}

Hinge.prototype.startPeerServer = function() {
    // Start a TCP Server
    net.createServer(function (socket) {
        var peer = this.peer = new Peer(socket.remoteAddress, socket.remotePort);
        peer.socket = socket;
        peer.name = socket.remoteAddress + ":" + socket.remotePort;

        // Handle incoming messages from clients.
        socket.on('data', function (data) {
            // on data
        });

        // Remove the client from the list when it leaves
        socket.on('end', function () {
           peer.socket = null;
        });

        // on peer connect
        this.onPeerConnect(peer);
    }.bind(this)).listen(this.tcpPeerPort);

    // Put a friendly message on the terminal of the server.
    console.log("Peer server running at port " + this.tcpPeerPort + "\n");
}

Hinge.prototype.connect = function(host, port) {
    var peer = this.peer = new Peer(host, port);

    var socket = new net.Socket();
    peer.socket = socket;
    client.connect(port, host, function() {
        console.log('Connected');
        // on peer connect
        this.onPeerConnect(peer);
    }.bind(this));

    client.on('data', function(data) {
        // on data
    });

    client.on('close', function() {
        console.log('Connection closed');
        peer.socket = null;
    });
}

module.exports = exports = Hinge;
