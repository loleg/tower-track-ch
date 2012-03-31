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

});
