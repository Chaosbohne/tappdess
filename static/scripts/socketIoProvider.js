
SocketIoProviderClient = function(url, port) {
  //SocketIoProviderClient.prototype.socketIoClient = io.connect(url + ':' + port);
  SocketIoProviderClient.prototype.socketIoClient = io.connect('http://tappdess.nodester.com:80');
  //SocketIoProviderClient.prototype.socketIoClient = new io.Socket(null, {port: 8000, rememberTransport: false}); 
  SocketIoProviderClient.prototype.markersArray = [];
  SocketIoProviderClient.prototype.data = null;
  
  var _this = this;

  this.socketIoClient.on('all', function(data){
    console.log(data);
  });

  this.socketIoClient.on('stationsRes', function(data){
  
    var markerProviderList = new MarkerProviderList();
    markerProviderList.setData(data, _this.get('map'), _this.get('position'));
    markerProviderList.showData();

  });
    
  SocketIoProviderClient.prototype.send = function(event, message){
    this.socketIoClient.emit(event, message);
  }
};
SocketIoProviderClient.prototype = new google.maps.MVCObject();