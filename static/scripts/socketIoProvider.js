
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
    markerProviderList.setData(data, _this.get('map'));
    markerProviderList.showData();

  });
    
  SocketIoProviderClient.prototype.send = function(event, message){
    this.socketIoClient.emit(event, message);
  }
  

  
  SocketIoProviderClient.prototype.setUIHandler = function() {
    
    _this = this;
    
    $('#petrol_container tr').hover(function() {
      var MarkerImage = new MarkerImageProvider();
      var pinImageYellow = MarkerImage.getPinImageYellow();  
        
      $(this).css({'background-color':'#F1F1F1' });
       var id = $(this).attr('id');
       
       for(var i = 0; i < _this.markersArray.length; i++) {
         if(_this.markersArray[i].station._id == id) {
            _this.last_icon = _this.markersArray[i].getIcon();
            _this.markersArray[i].setIcon(pinImageYellow);  
         }
       }
       
    }, function() {
      $(this).css({'background-color':'#fafafa' });
       var id = $(this).attr('id');
       
       for(var i = 0; i < _this.markersArray.length; i++) {
         if(_this.markersArray[i].station._id == id) {
            _this.markersArray[i].setIcon(_this.last_icon);  
         }
       }      
    });
    
    
    $('#petrol_container .info_button').click( function() {
      var id = $(this).closest('tr').attr('id');
       for(var i = 0; i < _this.markersArray.length; i++) {
         console.log(i);
         if(_this.markersArray[i].station._id == id) {
           console.log('hit');
           console.log(_this.markersArray[i]);
          
           
           /*
           var table =
             "<tr id=" + _this.markersArray[i].station._id + ">"
          + "<td class=\"first_column\">"
          + "moooooooooooin" + "</td>"
          + "</tr>"
           $('#petrol_detail').append(table);
           $('#petrol_overview').css({'display':'none'});
           $('#petrol_detail').css({'display':'table'});
           */
         }
       }      

    });
  }
};
SocketIoProviderClient.prototype = new google.maps.MVCObject();