mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map", // container ID
  center: coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
  zoom: 14, // starting zoom
});

console.log(coordinates);

// const marker1 = new mapboxgl.Marker({
//   color: "#ff0000ff",
//   draggable: true,
// })
//   .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML("<p>hello world</p>"))
//   .setLngLat(coordinates)
//   .addTo(map);

map.on("load", () => {
  // Load an image from an external URL.
  map.loadImage(
    "https://res.cloudinary.com/dyssi8wji/image/upload/v1761986553/location-svgrepo-com_1_hwbhvq.png",
    (error, image) => {
      if (error) throw error;

      // Add the image to the map style.
      map.addImage("WonderLust", image);

      // Add a data source containing one point feature.
      map.addSource("point", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: coordinates,
              },
            },
          ],
        },
      });

      // Add a layer to use the image to represent the data.
      map.addLayer({
        id: "points",
        type: "symbol",
        source: "point", // reference the data source
        layout: {
          "icon-image": "WonderLust", // reference the image
          "icon-size": 0.07,
        },
      });
    }
  );
});
