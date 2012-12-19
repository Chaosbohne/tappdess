

/**
 * A MarkerImageProvider that will handle all images that will be used from markers
 * Class is made singleton to work with only one instance.
 * 
 */
MarkerImageProvider = function() {
  var __instance;
  
  var pinImageYellow;
  var pinImageRed;
  var pinImageGreen;
  var pinImageBlueA;
  var pinImageBlueB;
  
  /**
   * @constructor
   */
  MarkerImageProvider = function MarkerImageProvider() {

    var pinColor = "f9f466";
    var pinText = "T";
    var pinTextColor = "000000";     
    pinImageYellow = new google.maps.MarkerImage('http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=' + pinText + '|' + pinColor + '|' + pinTextColor,
      new google.maps.Size(21, 34),
      new google.maps.Point(0,0),
      new google.maps.Point(10, 34));   
    
    
    pinText = "T";
    pinTextColor = "000000";     
    pinColor = "ff8075";
    pinImageRed = new google.maps.MarkerImage('http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=' + pinText + '|' + pinColor + '|' + pinTextColor,
      new google.maps.Size(21, 34),
      new google.maps.Point(0,0),
      new google.maps.Point(10, 34));  
    
    
    pinColor = "6bc64e";
    pinText = "T";
    pinTextColor = "000000";   
    pinImageGreen = new google.maps.MarkerImage('http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=' + pinText + '|' + pinColor + '|' + pinTextColor,
      new google.maps.Size(21, 34),
      new google.maps.Point(0,0),
      new google.maps.Point(10, 34));      
    
    pinColor = "419ff6";
    pinText = "A";
    pinTextColor = "000000";   
    pinImageBlueA = new google.maps.MarkerImage('http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=' + pinText + '|' + pinColor + '|' + pinTextColor + '|' + pinColor,
      new google.maps.Size(21, 34),
      new google.maps.Point(0,0),
      new google.maps.Point(10, 34));            
    
    pinColor = "419ff6";
    pinText = "B";
    pinTextColor = "000000"; 
    pinImageBlueB = new google.maps.MarkerImage('http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=' + pinText + '|' + pinColor + '|' + pinTextColor,
      new google.maps.Size(21, 34),
      new google.maps.Point(0,0),
      new google.maps.Point(10, 34));   
      
    MarkerImageProvider.prototype.getPinImageYellow = function() {
      return pinImageYellow;
    }  

    MarkerImageProvider.prototype.getPinImageRed = function() {
      return pinImageRed;
    }  

    MarkerImageProvider.prototype.getPinImageGreen = function() {
      return pinImageGreen;
    }      
    
    MarkerImageProvider.prototype.getPinImageBlueA = function() {
      return pinImageBlueA;
    }       
    
    MarkerImageProvider.prototype.getPinImageBlueB = function() {
      return pinImageBlueB;
    }         
    
    return __instance;
  }

  MarkerImageProvider.prototype = this;
  __instance = new MarkerImageProvider();
  __instance.constructor = MarkerImageProvider;
  
  return __instance;
};