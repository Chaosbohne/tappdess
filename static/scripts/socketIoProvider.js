
SocketIoProviderClient = function(url, port) {
  //SocketIoProviderClient.prototype.socketIoClient = io.connect(url + ':' + port);
  SocketIoProviderClient.prototype.socketIoClient = io.connect('http://tappdess.nodester.com:80');
  //SocketIoProviderClient.prototype.socketIoClient = new io.Socket(null, {port: 8000, rememberTransport: false}); 
  SocketIoProviderClient.prototype.markersArray = [];
  SocketIoProviderClient.prototype.data = null;
  
  var _this = this;
    
  $('.sort_of_petrol_button').click( function() {
    $('#sort_of_petrol_container .active').each(function() {
      $(this).removeClass('active');
      $(this).addClass('not_active');
    });
    
    $(this).removeClass('not_active');
    $(this).addClass('active');
    
    var id = $(this).attr('id');
    
    id = _this.getSelectionSort();
    _this.deleteAllData();
    _this.showData(id);
  });
  
  
  this.socketIoClient.on('all', function(data){
    console.log(data);
  });

  this.socketIoClient.on('stationsRes', function(data){
    _this.deleteAllMarkersAndData(); 
    if(data.length > 0) {
      if(_this.get('map')) {    
        _this.createAndShowMarkers(data);
        var id = _this.getSelectionSort();
        _this.showData(id);
        
        
        $('#info_container').jScrollPane();
        /*
        if(data.length == 0) {
          $('ul#petrolList').append(
             '<li>' 
          + '<label>' + 'Es wurden keine Tankstellen im Umkreis gefunden' + '</label>'
          + '</li>');
        }
        */
      }
      
      $('ul#petrolList li').click(function() {
       var pinColor = "088A08";
       var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor,
          new google.maps.Size(21, 34),
          new google.maps.Point(0,0),
          new google.maps.Point(10, 34));   
          
        for(var i = 0; i < _this.markersArray.length; i++) {
          if(_this.markersArray[i].get('id') == this.id){
            _this.markersArray[i].setIcon(pinImage);
          }else{
            _this.markersArray[i].setIcon();
          }
        }
      });
    }
  });
  


  SocketIoProviderClient.prototype.createAndShowMarkers = function(data) {
    var pinColor = "ff8075";
    var pinText = "T";
    var pinTextColor = "000000";   
    
    var pinImage = new google.maps.MarkerImage('http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=' + pinText + '|' + pinColor + '|' + pinTextColor,
      new google.maps.Size(21, 34),
      new google.maps.Point(0,0),
      new google.maps.Point(10, 34));        
  
    for(var i = 0; i < data.length; i++) {
      var marker = new google.maps.Marker({
        draggable: false,
        map: this.get('map'),
        position: new google.maps.LatLng(data[i].latLng.latitude, data[i].latLng.longitude),
        title: data[i].type,
        icon: pinImage
      });
      
      marker.set('station', data[i]);
      
      this.markersArray.push(marker);
    }
  }
  
  SocketIoProviderClient.prototype.getPriceWithId = function(marker, id) {
    if(id == 'e10') {
      return marker.station.price.e10;
    }else if(id == 'e5') {
      return marker.station.price.super;
    }else if(id == 'super_plus') {
      return marker.station.price.superPlus;
    }else if(id == 'diesel') {
      return marker.station.price.diesel;
    }else if(id == 'erdgas') {
      return marker.station.price.erdgas;
    }
    
    return 1;
  }
  
  SocketIoProviderClient.prototype.showData = function(id) {
    var pinColor = "6bc64e";
    var pinText = "T";
    var pinTextColor = "000000";   
    
    var pinImageGreen = new google.maps.MarkerImage('http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=' + pinText + '|' + pinColor + '|' + pinTextColor,
      new google.maps.Size(21, 34),
      new google.maps.Point(0,0),
      new google.maps.Point(10, 34));  
          
    pinColor = "ff8075";
    
    var pinImageRed = new google.maps.MarkerImage('http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=' + pinText + '|' + pinColor + '|' + pinTextColor,
      new google.maps.Size(21, 34),
      new google.maps.Point(0,0),
      new google.maps.Point(10, 34));  
      
    var cheapestPrice = '';
    var maybeCheapestPrice = '';
    for(var i = 0; i < this.markersArray.length; i++) {
      if(i == 0) {
        cheapestPrice = this.getPriceWithId(this.markersArray[i], id);
      }else {
        maybeCheapestPrice = this.getPriceWithId(this.markersArray[i], id);
      }
      
      var table = 
        "<tr id=" + this.markersArray[i].station._id + ">"
      +"<td class=\"first_column\">";
      
      
      if(i == 0 || cheapestPrice == maybeCheapestPrice) {
        table = table + "<img src=\"/images/cheapestPetrol.png\" alt=\"Petrol\" height=\"34\" width=\"21\">";
        this.markersArray[i].setIcon(pinImageGreen);
      }else {
        table = table + "<img src=\"/images/petrol_red.png\" alt=\"Petrol\" height=\"34\" width=\"21\">";
        this.markersArray[i].setIcon(pinImageRed);        
      }
      
      table = table + "</td><td class=\"second_column\">"
        +  "<label id=\"positionLabelValue\" class=\"petrol_type\">" + this.markersArray[i].station.type + "<br>"
        + "</label>"
        +  "<label class=\"petrol_sort\">"
        +  "E10: " + this.markersArray[i].station.price.e10 
        +  " Super: " + this.markersArray[i].station.price.super 
        +  " SuperPlus: " + this.markersArray[i].station.price.superPlus + "<br>"
        +  "Diesel: " + this.markersArray[i].station.price.diesel
        +  " Gas: " + this.markersArray[i].station.price.erdgas
        + "</label>"
        + "</td><td class=\"third_column\"><label>todo</label></td>"
        +"</tr>";  
        
      $('#petrol_container table').append(table);
    }
  }
  
  SocketIoProviderClient.prototype.deleteAllMarkersAndData = function() {
    if(this.markersArray) {
      for(var i = this.markersArray.length - 1; i >= 0; i--) {
        this.markersArray[i].setMap(null);
        this.markersArray.pop();
      }
    }
    this.deleteAllData();
  }
  
  SocketIoProviderClient.prototype.deleteAllData = function() {
    $('#petrol_container table tr').remove();
  }
  
  SocketIoProviderClient.prototype.setMapProvider = function(mapProviderr) {
    this.mapProvider = mapProviderr;
    console.log(this.mapProvider);
  }
  
  SocketIoProviderClient.prototype.send = function(event, message){
    this.socketIoClient.emit(event, message);
  }
  
  SocketIoProviderClient.prototype.getSelectionSort = function() {
    var id;
    $('#sort_of_petrol_container .active:first').each(function() {
      id = $(this).attr('id');
    });
    
    if(id == 'e10') {
      _this.selection_sort_e10();
    }else if(id == 'e5') {
      _this.selection_sort_super();
    }else if(id == 'super_plus') {
      _this.selection_sort_superPlus();
    }else if(id == 'diesel') {
      _this.selection_sort_diesel();
    }else if(id == 'erdgas') {
     _this.selection_sort_erdgas();
    }
    return id;
  }  
  
  SocketIoProviderClient.prototype.selection_sort_e10 = function() {
    for( var i = 0; i < this.markersArray.length; i++)
    {
      for( var j = i+1; j < this.markersArray.length; j++)
      {
        if(this.markersArray[i].station.price.e10 > this.markersArray[j].station.price.e10)
        {
          var tmp = this.markersArray[j];
          this.markersArray[j] = this.markersArray[i];
          this.markersArray[i] = tmp;
        }      
      }
    }
  }
  
  SocketIoProviderClient.prototype.selection_sort_super = function() {
    for( var i = 0; i < this.markersArray.length; i++)
    {
      for( var j = i+1; j < this.markersArray.length; j++)
      {
        if(this.markersArray[i].station.price.super > this.markersArray[j].station.price.super)
        {
          var tmp = this.markersArray[j];
          this.markersArray[j] = this.markersArray[i];
          this.markersArray[i] = tmp;
        }      
      }
    }
  }

  SocketIoProviderClient.prototype.selection_sort_superPlus = function() {
    for( var i = 0; i < this.markersArray.length; i++)
    {
      for( var j = i+1; j < this.markersArray.length; j++)
      {
        if(this.markersArray[i].station.price.superPlus > this.markersArray[j].station.price.superPlus)
        {
          var tmp = this.markersArray[j];
          this.markersArray[j] = this.markersArray[i];
          this.markersArray[i] = tmp;
        }      
      }
    }
  }

  SocketIoProviderClient.prototype.selection_sort_diesel = function() {
    for( var i = 0; i < this.markersArray.length; i++)
    {
      for( var j = i+1; j < this.markersArray.length; j++)
      {
        if(this.markersArray[i].station.price.diesel > this.markersArray[j].station.price.diesel)
        {
          var tmp = this.markersArray[j];
          this.markersArray[j] = this.markersArray[i];
          this.markersArray[i] = tmp;
        }      
      }
    }
  }  
  
  SocketIoProviderClient.prototype.selection_sort_erdgas = function() {
    for( var i = 0; i < this.markersArray.length; i++)
    {
      for( var j = i+1; j < this.markersArray.length; j++)
      {
        if(this.markersArray[i].station.price.erdgas > this.markersArray[j].station.price.erdgas)
        {
          var tmp = this.markersArray[j];
          this.markersArray[j] = this.markersArray[i];
          this.markersArray[i] = tmp;
        }      
      }
    }
  }
  
};
SocketIoProviderClient.prototype = new google.maps.MVCObject();