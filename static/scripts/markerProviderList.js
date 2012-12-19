
MarkerProviderList = function(myMarkerData, map) {
  var __instance;
  var listOfMarkers = new Array();
 
  MarkerProviderList = function MarkerProviderList() {  
      
    MarkerProviderList.prototype.deleteAllMarkersAndData = function() {
      if(listOfMarkers) {
        for(var i = listOfMarkers.length - 1; i >= 0; i--) {  
          listOfMarkers[i].getMarker().setMap(null);
          listOfMarkers[i] = null;
          listOfMarkers.pop();
        }
      }
      this.deleteAllData();
    
    }
    
    MarkerProviderList.prototype.deleteAllData = function() {
      $('#petrol_overview tr').remove();
      $('#petrol_detail tr').remove();
    }

    MarkerProviderList.prototype.deleteItem = function(id) {
      if(id) {
        for(var i = 0; i < listOfMarkers.length; i++) {
          if(listOfMarkers[i].getID() == id) {
            listOfMarkers[i].getMarker().setMap(null);
            listOfMarkers.splice(i, 1);
            return true;
          }
        }
      }
      return false;
    }
    
    MarkerProviderList.prototype.getSortID = function() {
      var id;
      $('#sort_of_petrol_container .active:first').each(function() {
        id = $(this).attr('id');
      });
      
      return id;
    }
    
    MarkerProviderList.prototype.sortListOfMarkers = function() {
      var id = this.getSortID();
      
      for( var i = 0; i < listOfMarkers.length; i++)
      {
        for( var j = i+1; j < listOfMarkers.length; j++)
        {
          if(listOfMarkers[i].getPriceWithID(id) > listOfMarkers[j].getPriceWithID(id))
          {
            var tmp = listOfMarkers[j];
            listOfMarkers[j] = listOfMarkers[i];
            listOfMarkers[i] = tmp;
          }      
        }
      }      
    }  
    
    MarkerProviderList.prototype.getListOfMarkers = function() {
      return listOfMarkers;
    }
   
    MarkerProviderList.prototype.setData = function(myMarkerData, map) {
      this.deleteAllMarkersAndData();
      for(var i = 0; i < myMarkerData.length; i++) {
        var markerProvider = new MarkerProvider(myMarkerData[i], map);
        if(markerProvider.getMarker() != null) {
          listOfMarkers.push(markerProvider);
        }
      }
      this.sortListOfMarkers();

    }      
    
    MarkerProviderList.prototype.showData = function() {
    
      this.deleteAllData();
    
      var cheapest;
      var moreCheapest;
      var id = this.getSortID();
      var table = '';
      
      for(var i = 0; i < listOfMarkers.length; i++) {
        if(i==0){
          cheapest = listOfMarkers[i].getPriceWithID(id);
        }else {
          moreCheapest = listOfMarkers[i].getPriceWithID(id);
        }
        
        if(cheapest == moreCheapest || i == 0) {
          table += listOfMarkers[i].getHtmlOverview(true, id);
        }else {
          table += listOfMarkers[i].getHtmlOverview(false, id);
        }
      }
      
      $('#petrol_detail').css({'display':'none'});
      $('#petrol_overview').css({'display':'table'});
      
      
      $('#petrol_overview').append(table);
      $('#info_container').jScrollPane();
      this.hoverHandler();
      this.clickDetailHander();
      this.clickDeleteHandler();
    }
    
    MarkerProviderList.prototype.initButtonHandler = function() {
      _this = this;
      $('.sort_of_petrol_button').click( function() {
        $('#sort_of_petrol_container .active').each(function() {
          $(this).removeClass('active');
          $(this).addClass('not_active');
        });
        
        $(this).removeClass('not_active');
        $(this).addClass('active');
        
        
        _this.sortListOfMarkers();    
        _this.showData();
        
      });    
    }
  
    MarkerProviderList.prototype.hoverHandler = function() {
      
      $('#petrol_container tr').hover(function() {
        var MarkerImage = new MarkerImageProvider();
        var pinImageYellow = MarkerImage.getPinImageYellow();  
        $(this).css({'background-color':'#F1F1F1' });
         var id = $(this).attr('id');
         
         for(var i = 0; i < listOfMarkers.length; i++) {
           if(listOfMarkers[i].getID() == id) {
              lastIconMarker = listOfMarkers[i].getIcon();
              listOfMarkers[i].setIcon(pinImageYellow);  
              lastIconData = $('#'+id +' img').attr('src');
              $('#'+id +' img').attr({'src':'/images/yellowMarker.png' });
           }
         }
         
      }, function() {
        if($('#petrol_overview').css('display') != 'none') {
          $(this).css({'background-color':'#fafafa' });
           var id = $(this).attr('id');
           for(var i = 0; i < listOfMarkers.length; i++) {
             if(listOfMarkers[i].getID() == id) {
                listOfMarkers[i].setIcon(lastIconMarker);  
                $('#'+id +' img').attr({'src':lastIconData});
             }
           }
        }         
      }); 
    }
  
    MarkerProviderList.prototype.clickDeleteHandler = function() {
      _this = this;
      $('#petrol_container .delete_button').click( function() {
        var id = $(this).closest('tr').attr('id');
        if(_this.deleteItem(id)) {
          $('#'+id).remove();
          _this.showData();
        }    
      });    
    }
  
    MarkerProviderList.prototype.clickDetailHander = function() {
      var _this = this;
      $('#petrol_container .info_button').click( function() {
        var MarkerImage = new MarkerImageProvider();
        var pinImageYellow = MarkerImage.getPinImageYellow();      
        var id = $(this).closest('tr').attr('id');
         for(var i = 0; i < listOfMarkers.length; i++) {
           if(listOfMarkers[i].getID() == id) {            
             var table = listOfMarkers[i].getHtmlDetail();
             listOfMarkers[i].setIcon(pinImageYellow);  
             $('#petrol_detail').append(table);
             $('#petrol_overview').css({'display':'none'});
             $('#petrol_detail').css({'display':'table'});
             _this.clickBackHandler();
           }
         }      
      });    
    }
  
    MarkerProviderList.prototype.clickBackHandler = function() {
      var _this = this;
      $('#petrol_container .back_button').click(function() {
        _this.showData();
      });
    }
  
    this.initButtonHandler();  
    return __instance;
  }
  
  MarkerProviderList.prototype = this;
  __instance = new MarkerProviderList();
  __instance.constructor = MarkerProviderList;
  
  return __instance;
}