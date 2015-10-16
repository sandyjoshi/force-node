function Device(address, port){
    this.address = address;
    this.port = port;
    this.socket = null;
    this.name = null;
}
Device.prototype.constructor = Device;
Device.prototype.sendMessage = function(data){
    if (!this.socket) return;
    this.socket.write(JSON.stringify(data));
};

module.exports = exports = Device;
