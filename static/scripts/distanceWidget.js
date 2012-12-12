    /* A LOT OF WIDGET FUN
    https://developers.google.com/maps/articles/mvcfun?hl=de-DE
    https://google-developers.appspot.com/maps/articles/mvcfun/step6?hl=de-DE
    view-source:https://google-developers.appspot.com/maps/articles/mvcfun/step6?hl=de-DE
    
    
    MORE COMPLEX SOURCE OF WIDGET - VERY INTERESSTING  
    http://code.google.com/p/psycho-geo/source/browse/geo-search/distancewidget.js?spec=svn2aeca411d886fb7b8eaf4d14de86a30e6c60ed14&r=3e9381d607a1612072933defa0c9813a0aa555bc
    */



      /**
       * A distance widget that will display a circle that can be resized and will
       * provide the radius in km.
       *
       * @param {google.maps.Map} map The map to attach to.
       *
       * @constructor
       */
      DistanceWidget = function() {
        DistanceWidget.prototype.radiusWidget = null;
        DistanceWidget.prototype.marker = null;
        
        this.set('distance', 1);

        //var pinColor = "18597f";
        var pinColor = "419ff6";
        var pinText = "A";
        var pinTextColor = "000000";   
        var pinImage = new google.maps.MarkerImage('http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=' + pinText + '|' + pinColor + '|' + pinTextColor + '|' + pinColor,
            new google.maps.Size(21, 34),
            new google.maps.Point(0,0),
            new google.maps.Point(10, 34));        
            
        this.marker = new google.maps.Marker({
          draggable: true,
          title: 'Zum Ändern ziehen',
          icon: pinImage
        });

        // Bind the marker map property to the DistanceWidget map property
        this.marker.bindTo('map', this);

        // Bind the marker position property to the DistanceWidget position
        // property
        this.marker.bindTo('position', this);

        // Create a new radius widget
        this.radiusWidget = new RadiusWidget();

        // Bind the radiusWidget map to the DistanceWidget map
        this.radiusWidget.bindTo('map', this);

        // Bind the radiusWidget center to the DistanceWidget position
        this.radiusWidget.bindTo('center', this, 'position');

        // Bind to the radiusWidgets' distance property
        this.bindTo('distance', this.radiusWidget);

        // Bind to the radiusWidgets' bounds property
        this.bindTo('bounds', this.radiusWidget);
      
        //this.bindTo('distance', radiusWidget, 'distance');
        
        var _this = this;
        google.maps.event.addListener(this.marker, 'dblclick', function() {
          // When a user double clicks on the icon fit to the map to the bounds
          _this.get('map').fitBounds(_this.get('bounds'));
        });
        
        google.maps.event.addListener(this.marker, 'dragend', function() {
          _this.get('map').setCenter(_this.get('position'));
        });        
      }
      DistanceWidget.prototype = new google.maps.MVCObject();