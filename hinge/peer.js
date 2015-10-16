function Peer(address, port){
    this.address = address;
    this.port = port;
    this.socket = null;
    this.name = null;
}
Peer.prototype.constructor = Peer;
Peer.prototype.sendMessage = function(data){
    if (!this.socket) return;
    this.socket.write(JSON.stringify(data));
};

module.exports = exports = Peer;
