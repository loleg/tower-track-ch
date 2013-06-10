function init() {



    // Based on https://github.com/bbrizzi/compass
    function rotate(angle) {
	    //compass.setAttribute("transform", "translate(125,125) rotate("+angle+")");
	    compass.style.transform = "rotate("+angle+"deg)";
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

    navigator.geolocation.getCurrentPosition(function(position) {       
	    var lonLat = 
		    new OpenLayers.LonLat(position.coords.longitude, position.coords.latitude)
		      .transform(
			      new OpenLayers.Projection("EPSG:4326"), //transform from WGS 1984
			      map.getProjectionObject() //to Spherical Mercator Projection
			    );
	
	    document.querySelector('#closer').onclick = function() {
            alert('come closer..');
		    map.setCenter(lonLat, 14);

		    api14.showMarker({
			    iconPath: 'http://make.opendata.ch/forum/uploads/DN2MBMFGGPQX.png',
			    graphicHeight: 30, graphicWidth: 30,
			    html: '<h1>Swiss Open Data Camp</h1><br><img src="https://p.twimg.com/ApOPq-gCAAA1Tj0.jpg" width="100%" /><a href="http://make.opendata.ch">make.opendata.ch</a>'
		    });

		    /*console.log(" Latitude: " + 
					    position.coords.latitude + 
				      " Longitude: " +
					    position.coords.longitude);*/
       
	    }; // -- end go-closer click

	    document.querySelector('#farther').onclick = function() {
            alert('go farther..');
		    map.setCenter(new OpenLayers.LonLat(684832.5,249677),9);

		    api14.showMarker({
			    iconPath: 'http://make.opendata.ch/forum/uploads/DN2MBMFGGPQX.png',
			    graphicHeight: 30, graphicWidth: 30,
			    html: '<h1>Swiss Open Data Camp</h1><br><img src="https://p.twimg.com/ApUTO45CMAAlpIQ.jpg" width="100%" /><a href="http://make.opendata.ch">make.opendata.ch</a>'
		    });
       
	    }; // -- end go-farther click

    }); // -- end geolocation
    
} 
