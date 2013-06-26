function init() {

	var CONFIG_SEARCH_RADIUS = 500,
		CONFIG_ZOOM_DEFAULT = 14,
		CONFIG_ZOOM_CLOSER = 9;

    // Based on https://github.com/bbrizzi/compass
    function rotate(angle) {
    	// Rotate virtual "compass"
	    //compass.setAttribute("transform", "translate(125,125) rotate("+angle+")");
	    //compass.style.transform = "rotate("+angle+"deg)";
	    
	    var origX = parseInt(document.querySelector('#map').style.width)/2;
	    var origY = parseInt(document.querySelector('#map').style.height)/2;
	    var layer = document.querySelector('#map div:first-child div:first-child');
		layer.style["-webkit-transform-origin"] = origX + "px " + origY + "px";
	    layer.style["-webkit-transform"] = "rotate("+angle+"deg)";
    }
    if (window.DeviceOrientationEvent) {
        window.addEventListener("deviceorientation", function( event ) {
            //alpha: rotation around z-axis
            var rotateDegrees = 360 - event.alpha;
	        //document.querySelector("#orientation").innerHTML = rotateDegrees;
	        rotate( rotateDegrees );
        }, false);
    }

    // Initialize Swiss map
    if (typeof GeoAdmin == 'undefined') return;
    //document.querySelector('#map').style.background = "none";
	document.querySelector('#map').style.width  = window.innerWidth + 'px';
	document.querySelector('#map').style.height = window.innerHeight + 'px';
	var api14 = new GeoAdmin.API(); 
    var map = api14.createMap({
        div: "map",
        easting: 501670,
        northing: 118760,
        zoom: 5
    });

    /*
    var gml = new OpenLayers.Layer.Vector("Point Layer", {
             strategies: [new OpenLayers.Strategy.Fixed()],
             protocol: new OpenLayers.Protocol.HTTP({
                 url: "data/antennes.xml",
                 format: new OpenLayers.Format.OSM()
             }),
             styleMap: new OpenLayers.StyleMap({
                 strokeColor: "#0066cc",
                 fillColor: "#3399ff",
                 pointRadius: 4
             }),
			// http://spatialreference.org/ref/epsg/2056/
			projection: new OpenLayers.Projection("EPSG:2056")
     });

    map.addLayer(gml);

	//console.log(gml);
	*/
	
    map.addLayerByName('ch.bakom.mobil-antennenstandorte-umts');
    map.addLayerByName('ch.bakom.mobil-antennenstandorte-lte');
    map.addLayerByName('ch.bakom.mobil-antennenstandorte-gsm');

    navigator.geolocation.getCurrentPosition(function(position) {       
	    var lonlat = 
		    new OpenLayers.LonLat(position.coords.longitude, position.coords.latitude)
		      .transform(
			      new OpenLayers.Projection("EPSG:4326"), //transform from WGS 1984
			      map.getProjectionObject() //to Spherical Mercator Projection
			    );
	    map.setCenter(lonlat, CONFIG_ZOOM_DEFAULT);
		//console.log(lonlat);
	
	    document.querySelector('#closer').onclick = function() {
        	map.setCenter(lonlat, CONFIG_ZOOM_CLOSER);	
        	
        	var scriptProtocol = new OpenLayers.Protocol.Script({
                 url: GeoAdmin.webServicesUrl + '/feature/search',
                 params: {
                     layers: 'ch.bakom.mobil-antennenstandorte-gsm',
                     //easting: lonlat.lon, northing: lonlat.lat,
                     bbox: 
                     	(lonlat.lon-CONFIG_SEARCH_RADIUS) + ',' +
                     	(lonlat.lat-CONFIG_SEARCH_RADIUS) + ',' +
                     	(lonlat.lon+CONFIG_SEARCH_RADIUS) + ',' +
                     	(lonlat.lat+CONFIG_SEARCH_RADIUS)
                 },
                 handleResponse: function(response) {
                     var message,lon,lat;
                     if (response.data.length == 0) {
                         api14.showPopup({
		                     recenter: "true",
		                     html: "No antennas nearby found, sorry"
		                 });
                     } else {
                         // Find the nearest
                         var shortestDist = 99999;
                         var nearestFeature = null;
                         //console.log(response.data);
                         
                         for (var i = 0; i < response.data.features.length; i++) {
                             var feature = response.data.features[i];
                             var X = feature.geometry.coordinates[1];
                             var Y = feature.geometry.coordinates[0];
                             var dist = Math.sqrt(Math.pow((lonlat.lon - Y), 2) + 
                             					  Math.pow((lonlat.lat - X), 2));
                             if (shortestDist > dist) {
                                 shortestDist = dist;
                                 nearestFeature = feature;
                                 nearestFeature.lat = X;
                                 nearestFeature.lon = Y;
                             }
                         }
                         
                         if (nearestFeature != null) {
		                     api14.showPopup({
			                     easting: nearestFeature.lon,
				                 northing: nearestFeature.lat,
				                 recenter: "true",
				                 html: "Closest GSM antenna to your location"
				             });
				             
		                 } else {
				             api14.showPopup({
				                 recenter: "true",
				                 html: "No antennas nearby found, sorry"
				             });
				         }
                     }
                 },
                 callbackKey: 'cb',
                 format: new OpenLayers.Format.JSON({
                     nativeJSON: false
                 }),
                 scope: this
             });
             scriptProtocol.read();
             
        	/*    

		    api14.showMarker({
			    iconPath: 'http://make.opendata.ch/forum/uploads/DN2MBMFGGPQX.png',
			    graphicHeight: 30, graphicWidth: 30,
			    html: '<h1>Swiss Open Data Camp</h1><br><img src="https://p.twimg.com/ApOPq-gCAAA1Tj0.jpg" width="100%" /><a href="http://make.opendata.ch">make.opendata.ch</a>'
		    });
			*/
		    /*console.log(" Latitude: " + 
					    position.coords.latitude + 
				      " Longitude: " +
					    position.coords.longitude);*/
       
	    }; // -- end go-closer click
	    
	    document.querySelector('#closer').click();

	    document.querySelector('#farther').onclick = function() {
            alert('Go far.. is not yet implemented.');
		    map.setCenter(new OpenLayers.LonLat(684832.5,249677), CONFIG_ZOOM_DEFAULT);
       
	    }; // -- end go-farther click

    }); // -- end geolocation
    
} 
