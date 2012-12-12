


// Initiate jQuery
$(document).ready(function() {
 
  // Create a function
  function getSize() {
  
    // Get the width and height of the window
    var winHeight = $(window).height();
    var winWidth = $(window).width();
   
    /*$('#wrapper_home').css({'width' : winWidth+'px', 'height' : winHeight+'px'});*/
    
    // Change the divs to that width and height
    if(winHeight < 600)
      winHeight = 600;
    if(winWidth < 950)
      winWidth = 950;
      
    $('#wrap').css({'width' : winWidth+'px', 'height' : winHeight+'px'});
    $('#home').css({'height' : (winHeight - 50) + 'px'});
    $('#map_container').css({'width' : (winWidth - 360) + 'px'});
    /*
    if(navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i)) {
      $('[data-full="true"]').css({'width' : winWidth+'px', 'height' : winHeight+70+'px'});
      $('.wrapper').css({'width' : winWidth+'px', 'height' : winHeight+'px'});
    }
    */
         
    // Check what page we're on in the document using the height and
    // scroll postion (That's $(window).scrollTop())

  }
    
  // When the user resizes the winow
  $(window).resize(function() {
      // Get the hash and height
      var hash = window.location.hash;
      var height = $(window).height();
       
      // Maintain scroll position based on hash.
      if(hash == '#home') { $(window).scrollTop(0); }
      else if(hash == '#share') { $(window).scrollTop(height); }
      else if(hash == '#about') { $(window).scrollTop(((height)*2)); }
      else if(hash == '#contact') { $(window).scrollTop((height*3)); }
      /*$('#wrapper_home').jScrollPane();*/
  });
      
  getSize();
  $(window).resize(getSize);
  $(window).scroll(getSize);

  /*$('#wrapper_home').jScrollPane();*/

  
  var socketIoProviderClient = new SocketIoProviderClient('http://localhost', 8000);
  var geoLocateProvider = new GeoLocateProvider();
  var mapProvider = new MapProvider('map_canvas', 'location', 'info_location', 'info_radius', geoLocateProvider, socketIoProviderClient); 
});    