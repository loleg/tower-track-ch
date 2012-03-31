$(document).ready(function() {

	$('#map').css('width', $(window).width() + 'px');
	$('#map').css('height', $(window).height() + 'px');

    var api14 = new GeoAdmin.API();
    api14.createMap({
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

    api14.map.addLayer(gml);

	//console.log(gml);

	navigator.geolocation.getCurrentPosition(function(position) {       
		var lonLat = 
			new OpenLayers.LonLat(position.coords.longitude, position.coords.latitude)
			  .transform(
				  new OpenLayers.Projection("EPSG:4326"), //transform from WGS 1984
				  api14.map.getProjectionObject() //to Spherical Mercator Projection
				);
		
		$('#go-closer').click(function() {

			api14.map.setCenter(lonLat, 14);

			api14.showMarker({
				iconPath: 'http://make.opendata.ch/forum/uploads/DN2MBMFGGPQX.png',
				graphicHeight: 30, graphicWidth: 30,
				html: '<h1>Swiss Open Data Camp</h1><br><img src="https://p.twimg.com/ApOPq-gCAAA1Tj0.jpg" width="100%" /><a href="http://make.opendata.ch">make.opendata.ch</a>'
			});

			/*console.log(" Latitude: " + 
						position.coords.latitude + 
					  " Longitude: " +
						position.coords.longitude);*/
	   
		}); // -- end go-closer click

		$('#go-further').click(function() {

			api14.map.setCenter(new OpenLayers.LonLat(684832.5,249677),9);

			api14.showMarker({
				iconPath: 'http://make.opendata.ch/forum/uploads/DN2MBMFGGPQX.png',
				graphicHeight: 30, graphicWidth: 30,
				html: '<h1>Swiss Open Data Camp</h1><br><img src="https://p.twimg.com/ApTXiiHCAAAwMZg.jpg" width="100%" /><a href="http://make.opendata.ch">make.opendata.ch</a>'
			});
	   
		}); // -- end go-farther click

	}); // -- end geolocation

});
