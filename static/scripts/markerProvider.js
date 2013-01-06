
MarkerProvider = function(myMarkerData, map) {
  
   this.marker;
   MarkerProvider.prototype.directionsDisplay = null;
   
  if(map && myMarkerData.latLng) {
    this.marker = new google.maps.Marker({
      draggable: false,
      map: map,
      position: new google.maps.LatLng(myMarkerData.latLng.latitude, myMarkerData.latLng.longitude),
      title: myMarkerData.type  
    });
    
    this.marker.station = myMarkerData;
  }else {
    this.marker = null;
  }
}

  MarkerProvider.prototype.getMarker = function() {
    return this.marker;
  };
 
  MarkerProvider.prototype.getID = function() {
   return this.marker.station._id;
  };  
  
  MarkerProvider.prototype.getIcon = function() {
   return this.marker.getIcon();
  }; 
  
  MarkerProvider.prototype.setIcon = function(pinImage) {
    this.marker.setIcon(pinImage);
  };   
  
  MarkerProvider.prototype.getPriceWithID = function(id) {
    if(id == 'e10') {
      return this.marker.station.price.e10;
    }else if(id == 'e5') {
      return this.marker.station.price.super;
    }else if(id == 'super_plus') {
      return this.marker.station.price.superPlus;
    }else if(id == 'diesel') {
      return this.marker.station.price.diesel;
    }else if(id == 'erdgas') {
      return this.marker.station.price.erdgas;
    }
    
    return 1; 
  };
  
  MarkerProvider.prototype.getPriceWithIDString = function(id) {
    if(id == 'e10') {
      return "E10: " + this.marker.station.price.e10;
    }else if(id == 'e5') {
      return "Super: " + this.marker.station.price.super;
    }else if(id == 'super_plus') {
      return "SuperPlus: " + this.marker.station.price.superPlus;
    }else if(id == 'diesel') {
      return "Diesel: " + this.marker.station.price.diesel;
    }else if(id == 'erdgas') {
      return "Gas: " + this.marker.station.price.erdgas;
    }
    
    return 'error'; 
  };  
  
  MarkerProvider.prototype.getHtmlOverview = function(cheapest, id) {
    var MarkerImage = new MarkerImageProvider();
    var pinImageGreen = MarkerImage.getPinImageGreen();  
    var pinImageRed = MarkerImage.getPinImageRed();  
    
    var table = 
      "<tr id=" + this.marker.station._id + ">"
      +"<td class=\"first_column\">";
        
    if(cheapest == true) {
      table += "<img src=\"/images/cheapestPetrol.png\" alt=\"Petrol\" height=\"34\" width=\"21\">";
      this.marker.setIcon(pinImageGreen);
    }else {
      table += "<img src=\"/images/petrol_red.png\" alt=\"Petrol\" height=\"34\" width=\"21\">";
      this.marker.setIcon(pinImageRed);        
    }
        
    table += "</td>" 
      + "<td class=\"second_column\">"
      + "<label class=\"petrol_type\">" + this.marker.station.type + "<br>" + "</label>"
      + "</td>"
      + "<td class=\"third_column\">"
      + "<label class=\"petrol_sort\">"
      + this.getPriceWithIDString(id)
      + "</label>"
      + "</td>"
      + "<td class=\"fourth_column\">"
      + "<button class=\"delete_button\">"
      + "<span class=\"delete_span\">" + "</span>"
      + "</button>"
      + "</td>"
      + "<td class=\"fifth_column\">"
      + "<button class=\"info_button\">"
      + "<span class=\"info_span\">" + "</span>"
      + "</button>"
      + "</td>"
      + "<td class=\"six_column\">"
      + "<button class=\"calc_button\">"
      + "<span class=\"calc_span\">" + "</span>"
      + "</button>"        
      + "</td>"
      +"</tr>";  
      
      return table;
  }
  
  MarkerProvider.prototype.getHtmlDetail = function() {
  
    console.log(this.marker.station);
    var table = 
      "<tr id=" + this.marker.station._id + ">"
      + "<td class=\"first_column_detail\">"
      + "<img src=\"/images/yellowMarker.png\" alt=\"Petrol\" height=\"34\" width=\"21\">"
      + "</td>" 
      + "<td class=\"second_column_detail\">"
      + "<label class=\"petrol_type\">" + this.marker.station.type + "</label>"
      + "<label class=\"petrol_address\">"
      + this.marker.station.street + ' ' + this.marker.station.number  + "<br>"
      + this.marker.station.zip + ' ' + this.marker.station.location      
      + "</label>"
      + "<label class=\"petrol_price\">"
      + "E10:          " + this.marker.station.price.e10 + "&euro;<br>"
      + "Super:       " + this.marker.station.price.super + "&euro;<br>"
      + "SuperPlus: " + this.marker.station.price.superPlus + "&euro;<br>"
      + "Diesel:       " + this.marker.station.price.diesel + "&euro;<br>"
      + "Gas:          " + this.marker.station.price.erdgas +'&euro;'
      + "</label>"
      + "</td>"
      + "<td class=\"third_column_detail\">"
      + "<button class=\"back_button\">"
      + "<span class=\"back_span\">" + "</span>"
      + "</button>"
      + "</td>"
      + "<td class=\"fourth_column_detail\">"
      + "<button class=\"calc_button\">"
      + "<span class=\"calc_span\">" + "</span>"
      + "</button>"        
      + "</td>"
      + "</tr>";  
      
      return table;  
  }
  
  MarkerProvider.prototype.getDirectionsService = function(start, callback) {
    var directionsService = new google.maps.DirectionsService();
    this.directionsDisplay = new google.maps.DirectionsRenderer({
    draggable: false,
    suppressInfoWindow: true,
    suppressMarkers: true,
    preserveViewport:true});
   
    this.directionsDisplay.setMap(this.marker.getMap());   
    
    var request = {
      origin:start,
      destination: this.marker.position,
      travelMode: google.maps.TravelMode.DRIVING
    };
    directionsService.route(request, function(result, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        callback(null, result);
      }else {
        callback(null);
      }
    });
  }
  
  MarkerProvider.prototype.getHtmlRoute = function(start, callback) {
    __this = this;
    this.getDirectionsService(start, function(error, result) {
       if(result) {
       __this.directionsDisplay.setDirections(result);
        var start_index = result.routes[0].legs[0].start_address.indexOf(', Deutschland');
        var end_index = result.routes[0].legs[0].end_address.indexOf(', Deutschland');
        var start_address;
        var end_address;
        if(start_index != -1) {
          start_address = result.routes[0].legs[0].start_address.substring(0, start_index);
        }else {
          start_address = result.routes[0].legs[0].start_address;
        }        
        
        if(end_index != -1) {
          end_address = result.routes[0].legs[0].end_address.substring(0, end_index);
        } else {
          end_address = result.routes[0].legs[0].end_address;
        }
        
        
        var steps = '';
        
        for(var i = 0; i < result.routes[0].legs[0].steps.length; i++) {
          steps += "<tr><td class=\"first_column_route\"><label>"+ (i+1) + "." +"</label></td>"
          +"<td class=\"second_column_route\"><label>"
          +result.routes[0].legs[0].steps[i].instructions
          +"</label></td>"
          +"<td><label>"
          +result.routes[0].legs[0].steps[i].distance.text
          +"</label></td></tr>";
        }
        
        
        var source = 
            "<div>"
          +"<table id=\"route_start\"><tr><td class=\"first_column_route\">" 
          +"<img src=\"/images/positionA.png\" alt=\"Petrol\" height=\"34\" width=\"21\">"
          +"</td><td class=\"second_column_route\"><label class=\"start_route\">"
          +start_address
          +"</label>"           
          +"</td><td class=\"third_column_detail\">"
          +"<button class=\"back_button\">"
          +"<span class=\"back_span\">" + "</span>"
          +"</button></td></tr></table>"
          +"<table id=\"route_steps\">"
          +steps
          +"</table>"
          +"<table id=\"route_end\"><tr><td class=\"first_column_route\">" 
          +"<img src=\"/images/yellowMarker.png\" alt=\"Petrol\" height=\"34\" width=\"21\">"
          +"</td><td class=\"second_column_route\"><label class=\"end_route\">"
          +end_address
          +"</label>"           
          +"</td></tr></table>"
          +"<label class=\"maps_copyright\">"+result.routes[0].copyrights+"</label>"
          +"</div>";
          callback(null, source);
       }else {
         callback(null);
       }
    });
  }
  
  MarkerProvider.prototype.removeDirectionsResult = function() {
    if(this.directionsDisplay) {
      this.directionsDisplay.setMap(null);
    }
  }