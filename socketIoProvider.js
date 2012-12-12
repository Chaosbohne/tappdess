var io = require('socket.io');

SocketIoProvider = function (expressServer, petrolProvider) {
  this.socketIo = io.listen(expressServer);
  this.socketIo.sockets.on('connection', function (socket) {
    console.log('SOCKET IO CONNECTED');
    
    
    socket.on('geolocation', function (data) {
      console.log(data);
    });
    
    socket.on('stations', function(data) {
      console.log('stations requested longitude: ' + data.longitude);
      console.log('stations requested latitude: ' + data.latitude);
      console.log('stations requested radius: ' + data.radius);
      
      petrolProvider.findAllWithRadius(data, function(error, stations) {
        if(!error) {
          socket.emit('stationsRes',stations);
        }
      });
    });
    /*
    socket.on('allStations', function() {
      petrolProvider.findAll( function(error, stations) {
        socket.emit('all',stations);
      });
    });
    
    socket.on('disconnect', function () {
      console.log('Socket.io connection closed');
    });
    
    socket.on('newPlace', function(data) {
      console.log('new Place: ' + data);
    });
   */
  });
};

exports.SocketIoProvider = SocketIoProvider;