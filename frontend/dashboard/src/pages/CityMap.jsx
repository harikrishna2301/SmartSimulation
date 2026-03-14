import { MapContainer, TileLayer, Circle, Tooltip } from "react-leaflet";

function CityMap() {
  const locations = [
    { name: "Banjara Hills", lat: 17.4126, lng: 78.4482, pm25: 85 },

    { name: "Hitech City", lat: 17.4435, lng: 78.3772, pm25: 120 },

    { name: "Secunderabad", lat: 17.4399, lng: 78.4983, pm25: 60 },

    { name: "Kukatpally", lat: 17.4948, lng: 78.3996, pm25: 140 },

    { name: "Gachibowli", lat: 17.4401, lng: 78.3489, pm25: 75 },
  ];

  const getColor = (pm) => {
    if (pm < 50) return "green";
    if (pm < 100) return "yellow";
    return "red";
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Hyderabad Pollution Monitoring Map
      </h1>

      <div className="bg-white p-4 rounded-xl shadow">
        <MapContainer
          center={[17.385, 78.4867]}
          zoom={11}
          style={{ height: "500px", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {locations.map((loc, i) => (
            <Circle
              key={i}
              center={[loc.lat, loc.lng]}
              radius={1200}
              pathOptions={{
                color: getColor(loc.pm25),
                fillColor: getColor(loc.pm25),
                fillOpacity: 0.5,
              }}
            >
              <Tooltip>
                <b>{loc.name}</b>
                <br />
                PM2.5: {loc.pm25}
              </Tooltip>
            </Circle>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}

export default CityMap;
