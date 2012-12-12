
GeoLocateProvider = function() {
  GeoLocateProvider.prototype.myCountry = 'de';  
  GeoLocateProvider.prototype.geocoder = new google.maps.Geocoder();
  
  GeoLocateProvider.prototype.ipLocationPackage = function(callback) {
    console.log('Using iplocationPackage');
    console.log(this.geocoder);
    console.log(this.myCountry);
    this.ipLocationCodeLatLng( function(addr) {
      if(addr) callback(null, addr);
      else callback(null);
    });      
  }
  
  GeoLocateProvider.prototype.defaultLocationPackage = function(callback) {
    console.log('Using defaultlocationPackage');
    myBounds = new google.maps.LatLngBounds();
    if(myBounds) {
     myBounds.extend(new google.maps.LatLng(47.2701115, 5.866342499999973));
     myBounds.extend(new google.maps.LatLng(55.058347, 15.041896199999996));  
    }
    
    this.geocoder.geocode({'region':'de', 'bounds':myBounds}, function(results, status){
      if(status == google.maps.GeocoderStatus.OK) {
        callback(null, results);
      }else {
        callback(null);
      }
    });  
  }
  
  GeoLocateProvider.prototype.geoLocateAdress = function(address, callback) {
    this.geocoder.geocode({'region':'de', 'address':address}, function(results, status) {
      if(status == google.maps.GeocoderStatus.OK) {
        callback(null, results);
      }else {
        callback(null);
      }      
    });  
  }

  function geoLocationGetPosition(callback) {
    console.log('Using geolocationPackage');

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function(position) {
          callback(null, position);
        }, function(error) {
          callback(null);
        }
      );
    } else {
      alert("Not Supported!");
    }
  }

  GeoLocateProvider.prototype.geoLocationCodeLatLng = function(position, callback) {
    if(position.Ya) {
      var latLng = new google.maps.LatLng(position.Ya,position.Za);
    }else if(position.coords) {
        if(position.coords.latitude) {
          var latLng = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
        } else {
          callback(null);
        }
    }else {
      callback(null);
    }
    
    this.geocoder.geocode({'latLng':latLng, 'region':'de'}, function(results, status) {
      if(status == google.maps.GeocoderStatus.OK) {
        callback(null, results[0]);
      }else {
        callback(null);
      }
    });  
  }

  GeoLocateProvider.prototype.ipLocationCodeLatLng = function (callback){
    if(this.geocoder) {
      var city;
      var country;
      var latLng = new google.maps.LatLng(google.loader.ClientLocation.latitude, google.loader.ClientLocation.longitude);
      
      var _this = this;
      this.geocoder.geocode({'latLng': latLng, 'region':'de'}, function(results, status) {
        if(status == google.maps.GeocoderStatus.OK) {
          for(var i=0; i<results[0].address_components.length; i++) {
            for(var j=0; j<results[0].address_components[i].types.length;j++) {
              if(results[0].address_components[i].types[j] == 'locality') {
                city = results[0].address_components[i].long_name;
              } else if(results[0].address_components[i].types[j] == 'country') {
                country = results[0].address_components[i].short_name;
              }
            }          
          }
          
          if(city != null && country.toLowerCase() == _this.myCountry) {
            _this.geocoder.geocode({'address':city + ' '+ country}, function(results, status){
              if(status == google.maps.GeocoderStatus.OK) {
                callback(results);
              }else {
                callback(null);
              }
            });
          }else {
            callback(null);
          }
        }else {
          callback(null);
        }
      });
    }else {
      callback(null);
    }
  }
  
  GeoLocateProvider.prototype.geoLocationPackage = function(callback) {
    _this = this;
    geoLocationGetPosition( function(error, position) {
      if(position) {
        console.log(position);
        _this.geoLocationCodeLatLng(position, function(error, results) {
          if(!error) {
            callback(null, results);
          }else {
            callback(null);
          }
        });
      }else {
        callback(null);
      }
    });
  }  
};


 