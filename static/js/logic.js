// Create the 'basemap' tile layer that will be the background of our map.
let basemap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
});

// OPTIONAL: Step 2
// Create the 'street' tile layer as a second background of the map


// Create the map object with center and zoom options.
let myMap = L.map("map").setView([39.8283, -98.5795], 5);

// Then add the 'basemap' tile layer to the map.
basemap.addTo(myMap);

// OPTIONAL: Step 2
// Create the layer groups, base maps, and overlays for our two sets of data, earthquakes and tectonic_plates.
// Add a control to the map that will allow the user to change which layers are visible.


// Make a request that retrieves the earthquake geoJSON data.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function (data) {

  // This function returns the style data for each of the earthquakes we plot on
  // the map. Pass the magnitude and depth of the earthquake into two separate functions
  // to calculate the color and radius.
  function styleInfo(feature) {
    return {
        opacity: 1,
        fillOpacity: 0.6,
        fillColor: getColor(feature.geometry.coordinates[2]), // Get color based on depth
        color: "#000000", // Outline color
        radius: getRadius(feature.properties.mag), // Get radius based on magnitude
        stroke: true,
        weight: 0.5
    };
}

// This function determines the color of the marker based on the depth of the earthquake.
function getColor(depth) {
    if (depth > 90) {
        return "#ff0000"; // Red for deep earthquakes
    } else if (depth > 70) {
        return "#ff7f00"; // Orange for moderately deep earthquakes
    } else if (depth > 50) {
        return "#ffff00"; // Yellow for shallow earthquakes
    } else if (depth > 30) {
        return "#7fff00"; // Light green for very shallow earthquakes
    } else {
        return "#00ff00"; // Green for the shallowest earthquakes
    }
}

// This function determines the radius of the earthquake marker based on its magnitude.
function getRadius(magnitude) {
    if (magnitude === 0) {
        return 1; // Minimum radius for no magnitude
    }
    return magnitude * 4; // Scale the radius based on magnitude
}

// Add a GeoJSON layer to the map once the file is loaded.
L.geoJson(data, {
  // Turn each feature into a circleMarker on the map.
  pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, {
          radius: getRadius(feature.properties.mag), 
          fillColor: getColor(feature.geometry.coordinates[2]), 
          color: "#000000", 
          weight: 1, 
          opacity: 1, 
          fillOpacity: 0.6 
      });
  },

  // Set the style for each circleMarker using our styleInfo function.
  style: styleInfo,

  // Create a popup for each marker to display the magnitude and location of the earthquake after the marker has been created and styled
  onEachFeature: function (feature, layer) {
      layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
  }
}).addTo(myMap); 


  // OPTIONAL: Step 2
  // Add the data to the earthquake layer instead of directly to the map.
  }).addTo(map);

// Create a legend control object.
let legend = L.control({
  position: "bottomright"
});

// Then add all the details for the legend
legend.onAdd = function () {
  let div = L.DomUtil.create("div", "info legend");

  // Initialize depth intervals and colors for the legend
  const depthIntervals = [
      { limit: 0, color: "#00ff00" }, 
      { limit: 30, color: "#7fff00" }, 
      { limit: 50, color: "#ffff00" }, 
      { limit: 70, color: "#ff7f00" }, 
      { limit: 90, color: "#ff0000" }  
  ];

  // Loop through our depth intervals to generate a label with a colored square for each interval.
  depthIntervals.forEach(interval => {
      div.innerHTML +=
          '<i style="background:' + interval.color + '"></i> ' +
          interval.limit + (depthIntervals.indexOf(interval) < depthIntervals.length - 1 ? ' &ndash; ' + depthIntervals[depthIntervals.indexOf(interval) + 1].limit + '<br>' : '+<br>');
  });

  return div;
};

// Finally, add the legend to the map.
legend.addTo(myMap);


  // OPTIONAL: Step 2
  // Make a request to get our Tectonic Plate geoJSON data.
  d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json").then(function (plate_data) {
    // Save the geoJSON data, along with style information, to the tectonic_plates layer.


    // Then add the tectonic_plates layer to the map.

  });