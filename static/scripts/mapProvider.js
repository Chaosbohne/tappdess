
MapProvider = function(mapID, input1, input2, input3, geoLocateProvider, socketIoProviderClient) {
  MapProvider.prototype.mapDiv = document.getElementById(mapID);
  MapProvider.prototype.inputField = document.getElementById(input1);
  MapProvider.prototype.inputFieldInfo = document.getElementById(input2);
  MapProvider.prototype.autocomplete = null;
  MapProvider.prototype.autocomplete_input_container = null;
  MapProvider.prototype.geoLocateProvider = geoLocateProvider;
  MapProvider.prototype.socketIoProviderClient = socketIoProviderClient;
  MapProvider.prototype.distanceWidget = null;
  
  var _this = this;
  
  function createBindings(results) { 
        var myOptions = { mapTypeId: google.maps.MapTypeId.ROADMAP, center: results[0].geometry.location};
        _this.set('map', new google.maps.Map(_this.mapDiv, myOptions));
        _this.set('position_name', results[0].address_components[0].long_name);
        _this.set('position', results[0].geometry.location);
       
       
        _this.distanceWidget = new DistanceWidget();
        _this.distanceWidget.bindTo('map', _this);
        _this.distanceWidget.bindTo('position', _this); 
        
        
        _this.bindTo('radius', _this.distanceWidget, 'distance');
        _this.get('map').fitBounds(_this.distanceWidget.get('bounds'));
        
        _this.initAutocomplete();
        _this.initAutocompleteHandler();
        _this.socketIoProviderClient.bindTo('map', _this);
        
        google.maps.event.addListener(_this.distanceWidget.marker, 'dragend', function() {
          _this.geoLocateProvider.geoLocationCodeLatLng( _this.get('position'), function(error, results) {
            if(results) {
            
              var index = results.formatted_address.indexOf(', Deutschland');
              var address;
              if(index != -1) {
                address = results.formatted_address.substring(0, index);
              }else {
                address = results.formatted_address;
              }
              _this.setBindings(_this.get('position'), address);
            }
          });
        });        
        
        google.maps.event.addListener(_this.distanceWidget.radiusWidget.sizer, 'dragend', function() {
          _this.send_position_and_radius();
        });
  }
  
  geoLocateProvider.ipLocationPackage( function(error, results) {
    if(results) {
      if(results[0].geometry.location) {
        createBindings(results);
      }
    }else {
      geoLocateProvider.defaultLocationPackage( function (error, results) {
        if(results) {
          if(results[0].geometry.location) {
            createBindings(results);
          }
        }
      });
    }
    
    $('#geoLocate').click(function () {
      geoLocateProvider.geoLocationPackage( function (error, results) {
        if(results) {
          var index = results.formatted_address.indexOf(', Deutschland');
          var address;
          if(index != -1) {
            address = results.formatted_address.substring(0, index);
          }else {
            address = results.formatted_address;
          }
           _this.setBindings(results.geometry.location, address);
        }
      });
    });
  });
  
  
  MapProvider.prototype.send_position_and_radius = function () {
    var mySpot = {
      longitude: this.get('position').Za,
      latitude: this.get('position').Ya,
      radius: this.get('radius')/(6371)
    };   

    this.socketIoProviderClient.send('stations', mySpot);          
  }
  
  MapProvider.prototype.radius_changed = function() {
    $('input#info_radius').val(Math.round(this.get('radius') * 100)/100 + ' km');
  };
  
  MapProvider.prototype.position_name_changed = function() {
    console.log('position_name_changed changed');
    $('input#info_location').val(this.get('position_name'));
  };

  MapProvider.prototype.initAutocomplete = function() {  
    var myOptions = {
      types: ['geocode']
    };
  
    this.autocomplete = new google.maps.places.Autocomplete(this.inputField, myOptions);
    this.autocomplete.bindTo('bounds', this.get('map'));
    this.autocomplete_input_container = new google.maps.places.Autocomplete(this.inputFieldInfo, myOptions);
    this.autocomplete_input_container.bindTo('bounds', this.get('map'));    
  }
  
  MapProvider.prototype.initAutocompleteHandler = function() {
    var _this = this;
    
    google.maps.event.addListener(_this.autocomplete, 'place_changed', function() {
      console.log('listener');
        var place = _this.autocomplete.getPlace();
        if(place.geometry) {
          if (place.geometry.location) {
            _this.setBindings(place.geometry.location, place.name);
          }
        }
    });  
    
    google.maps.event.addListener(_this.autocomplete_input_container, 'place_changed', function() {
      console.log('listener');
        var place = _this.autocomplete_input_container.getPlace();
        if(place.geometry) {
          if (place.geometry.location) {
            _this.setBindings(place.geometry.location, place.name);
          }
        }
    });      
    
    $('input#info_radius').focusin(function () {
      var index = $(this).val().indexOf(' km');
      if( index > 0) {
        $(this).val($(this).val().substring(0,index));
      }
    }); 
    
    $('input#info_radius').focusout(function () {
      var input = $(this).val().replace(',','.');
      console.log(input);
      var i = parseFloat(input);
      console.log(i);
      if(isNaN(i)) {
        console.log('isnan');
        $(this).val(_this.get('radius') + ' km');
      }else {
        console.log('else');
        var j = Math.round(i * 100)/100;
        console.log(j);
        $(this).val(j + ' km');
        _this.distanceWidget.radiusWidget.setDistanceOnInput(j);
        _this.send_position_and_radius();
      }
    });    
    
    $(".form form").submit(function() {
      return false;
    });    
    
    $('#'+input3).focusin(function () {
      $(document).keypress(function (e) {
        if (e.which == 13) {
          $('#info_container').focus();
        }
      });
    });    
    
    $('#'+input1).focusin(function () {
      $(document).keypress(function (e) {
        if (e.which == 13) {
          takeFirstItem('first');
        }
      });
    });
  
    $('#'+input2).focusin(function () {
      $(document).keypress(function (e) {
        if (e.which == 13) {
          takeFirstItem('last');
        }
      });
    });
    
    $('button#submitLocation').click(function () {
      takeFirstItem('first');
    });  
    
    
    function takeFirstItem(whichContainer) {
      var firstResult = '';
      if(whichContainer == 'first')
        firstResult = $(".pac-container:first .pac-item:first").text();
      else
        firstResult = $(".pac-container:last .pac-item:first").text();
        
      if(firstResult.length == 0) {
        if(whichContainer == 'first')
          firstResult = $('#'+input1).val();
        else
          firstResult = $('#'+input2).val();
      }
      _this.geoLocateProvider.geoLocateAdress(firstResult, function(error, results) {
        if(results) {
          _this.setBindings(results[0].geometry.location, results[0].address_components[0].long_name);
        }else {
          console.log('focusin-handler: no address found');
        }
      });
    };
  }
  
  MapProvider.prototype.setBindings = function(position, position_name) {
    _this.set('position', position);
    _this.set('position_name', position_name);
    _this.get('map').fitBounds(_this.distanceWidget.get('bounds'));
      
    var mySpot = {
      longitude: position.Za,
      latitude: position.Ya,
      radius: _this.get('radius')/(6371)
    };              
    _this.socketIoProviderClient.send('stations', mySpot);    
  }  
};
MapProvider.prototype = new google.maps.MVCObject();


