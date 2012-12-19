      /**
       * A radius widget that add a circle to a map and centers on a marker.
       *
       * @constructor
       */
      RadiusWidget = function() {
       RadiusWidget.prototype.sizer = null;
       
        var circle = new google.maps.Circle({
          strokeWeight: 2
        });

        
        // Set the distance property value, default to 50km.
        this.set('distance', 1);

        // Bind the RadiusWidget bounds property to the circle bounds property.
        this.bindTo('bounds', circle);

        // Bind the circle center to the RadiusWidget center property
        circle.bindTo('center', this);

        // Bind the circle map to the RadiusWidget map
        circle.bindTo('map', this);

        // Bind the circle radius property to the RadiusWidget radius property
        circle.bindTo('radius', this);

        // Add the sizer marker
        this.addSizer_();
        
      }
      RadiusWidget.prototype = new google.maps.MVCObject();


      /**
       * Update the radius when the distance has changed.
       */
      RadiusWidget.prototype.distance_changed = function() {
        this.set('radius', this.get('distance') * 1000);
      };


      /**
       * Add the sizer marker to the map.
       *
       * @private
       */
      RadiusWidget.prototype.addSizer_ = function() {
        var MarkerImage = new MarkerImageProvider();
        var pinImageBlueB = MarkerImage.getPinImageBlueB();    
      
        this.sizer = new google.maps.Marker({
          draggable: true,
          title: 'Zum Ändern ziehen',
          icon: pinImageBlueB
        });

        this.sizer.bindTo('map', this);
        this.sizer.bindTo('position', this, 'sizer_position');

        var _this = this;
        google.maps.event.addListener(this.sizer, 'drag', function() {
          // Set the circle distance (radius)
          _this.setDistance();
        });
        
        
        google.maps.event.addListener(this.sizer, 'dragend', function() {
          _this.get('map').fitBounds(_this.get('bounds'));
        });
        
      };


      /**
       * Update the center of the circle and position the sizer back on the line.
       *
       * Position is bound to the DistanceWidget so this is expected to change when
       * the position of the distance widget is changed.
       */
      RadiusWidget.prototype.center_changed = function() {
        var bounds = this.get('bounds');

        // Bounds might not always be set so check that it exists first.
        if (bounds) {
          var lng = bounds.getNorthEast().lng();

          // Put the sizer at center, right on the circle.
          var position = new google.maps.LatLng(this.get('center').lat(), lng);
          this.set('sizer_position', position);
        }
      };


      /**
       * Calculates the distance between two latlng points in km.
       * @see http://www.movable-type.co.uk/scripts/latlong.html
       *
       * @param {google.maps.LatLng} p1 The first lat lng point.
       * @param {google.maps.LatLng} p2 The second lat lng point.
       * @return {number} The distance between the two points in km.
       * @private
       */
      RadiusWidget.prototype.distanceBetweenPoints_ = function(p1, p2) {
        if (!p1 || !p2) {
          return 0;
        }

        //var km1 = 1/Math.cos(Math.sin(p1.lat()  * Math.PI / 180) * Math.sin(p2.lat() * Math.PI / 180) + Math.cos(p1.lat()  * Math.PI / 180) * Math.cos(p2.lat() * Math.PI / 180) * Math.cos(p1.lng() * Math.PI / 180 - p2.lng() * Math.PI / 180)) * 6371;    
        //console.log('km: ' + km1);        
        

        
        var R = 6371; // Radius of the Earth in km
        var dLat = (p2.lat() - p1.lat()) * Math.PI / 180;
        var dLon = (p2.lng() - p1.lng()) * Math.PI / 180;
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(p1.lat() * Math.PI / 180) * Math.cos(p2.lat() * Math.PI / 180) *
          Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        return d;
      };

      /**
       * Calculate y-scale of p2 if distance changes
       * @see http://www.movable-type.co.uk/scripts/latlong.html
       *
       * @param {google.maps.LatLng} p1 The first lat lng point.
       * @param {google.maps.LatLng} p2 The second lat lng point.
       * @return {number} The distance between the two points in km.
       * @private
       */
       
      RadiusWidget.prototype.yOfPoint = function(p1, d) {
        
        var p1_lat, p1_lng, p2_lat, p2_lng;
        p1_lat  = p1.lat() * Math.PI / 180;
        p1_lng = p1.lng() * Math.PI / 180;
        p2_lat = p1_lat;
        
        console.log('p1 lat' + p1.lat());
        console.log('p1 long' + p1.lng());        
        
        var a = (Math.cos(d/6371)-Math.sin(p1_lat) * Math.sin(p2_lat)) / (Math.cos(p1_lat) * Math.cos(p1_lat));
        //var p2_lng = Math.acos(a) * (-1) / (Math.PI / 180) + p1.lng();
        var p2_lng = Math.acos(a) / (Math.PI / 180) + p1.lng();
        var position = new google.maps.LatLng(p1.lat(), p2_lng);

        this.set('sizer_position', position);       
      };      
      
      /**
       * Set the distance of the circle based on the position of the sizer.
       */
      RadiusWidget.prototype.setDistance = function() {
        // As the sizer is being dragged, its position changes.  Because the
        // RadiusWidget's sizer_position is bound to the sizer's position, it will
        // change as well.
        var pos = this.get('sizer_position');
        var center = this.get('center');
        var distance = this.distanceBetweenPoints_(center, pos);

        // Set the distance property for any objects that are bound to it
        this.set('distance', distance);
      };
      
      /**
       * Set the distance of the circle based on input field.
       */
      RadiusWidget.prototype.setDistanceOnInput = function(distance) {
        // As the sizer is being dragged, its position changes.  Because the
        // RadiusWidget's sizer_position is bound to the sizer's position, it will
        // change as well.
       // var pos = this.get('sizer_position');
       // var center = this.get('center');
        console.log('Distance: ' + distance);
        this.yOfPoint( this.get('center'),distance);
        this.set('distance', distance);        
        this.get('map').fitBounds(this.get('bounds'));
        // Set the distance property for any objects that are bound to it
       // this.set('distance', pos);
      };      