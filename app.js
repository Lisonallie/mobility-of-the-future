var mapContainer = document.getElementById('mapPlacement');
let apikey = "LTzX9tBeBAvAef7dz4mX52t8KUYdBCcwbJY_lm1iJ4g";
let reserved = document.getElementById("reserved");
let openMapDiv = document.getElementById("mobilityPage");

var platform = new H.service.Platform({
    apikey: apikey
  });
  
  var defaultLayers = platform.createDefaultLayers();
  
  //Step 2: initialize a map - this map is centered over Berlin
  var map = new H.Map(mapContainer,
    defaultLayers.vector.normal.map,{
    center: {lat:51.23065, lng:4.44271},
    zoom: 13,
    pixelRatio: window.devicePixelRatio || 1
  });
  // add a resize listener to make sure that the map occupies the whole container
  window.addEventListener('resize', () => map.getViewPort().resize());
  
  //Step 3: make the map interactive
  // MapEvents enables the event system
  // Behavior implements default interactions for pan/zoom (also on mobile touch environments)
  var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
  
  // Create the default UI components
  var ui = H.ui.UI.createDefault(map, defaultLayers);

  var polyline;

  function calculateRouteFromAtoB (modeOfTransport) {
    var router = platform.getRoutingService(),
      routeRequestParams = {
        mode: 'fastest;' + modeOfTransport,
        representation: 'display',
        routeattributes : 'waypoints,summary,shape,legs',
        maneuverattributes: 'direction,action',
        waypoint0: '51.24304,4.4747', // random address
        waypoint1: '51.23065,4.44271'  // Sportpaleis Antwerp
      };
  
  
    router.calculateRoute(
      routeRequestParams,
      onSuccess,
      onError
    );
  }

  function addMarkersToMap(map) {
    var sportpaleisMarker = new H.map.Marker({lat:51.23065, lng:4.44271});
    map.addObject(sportpaleisMarker);
  }


  function onSuccess(result) {
    var route = result.response.route[0];
   /*
    * The styling of the route response on the map is entirely under the developer's control.
    * A representitive styling can be found the full JS + HTML code of this example
    * in the functions below:
    */
    addRouteShapeToMap(route);
    addMarkersToMap(map);
    // ... etc.
  }

  function addRouteShapeToMap(route){
    var lineString = new H.geo.LineString(),
      routeShape = route.shape;
  
    routeShape.forEach(function(point) {
      var parts = point.split(',');
      lineString.pushLatLngAlt(parts[0], parts[1]);
    });
    if(polyline) {
        map.removeObject(polyline);
    }
    polyline = new H.map.Polyline(lineString, {
      style: {
        lineWidth: 4,
        strokeColor: 'rgba(0, 128, 255, 0.7)'
      }
    });
    // Add the polyline to the map
    map.addObject(polyline);
    // And zoom to its bounding rectangle
    map.getViewModel().setLookAtData({
      bounds: polyline.getBoundingBox()
    });
  }


  function onError(error) {
    alert('Can\'t reach the remote server');
  }

  reserved.addEventListener("click", openMap);

  function openMap() {
    console.log(reserved)
    openMapDiv.classList.toggle("show");
  }