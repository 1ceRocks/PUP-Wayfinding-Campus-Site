const map = L.map("map").setView([14.5995, 120.9842], 17);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);

// Read ?id= from URL
const params = new URLSearchParams(window.location.search);
const buildingId = params.get("id")?.toUpperCase();

if (buildingId) {
  fetch("buildings.json")
    .then(res => res.json())
    .then(buildingData => {
      const building = buildingData.find(b => b.id === buildingId);
      if (building) {
        L.marker([building.lat, building.lng]).addTo(map)
          .bindPopup(`<strong>${building.name}</strong><br>${building.description}`)
          .openPopup();

        document.getElementById("building-name").textContent = building.name;
        document.getElementById("building-description").textContent = building.description;
        document.getElementById("building-id").textContent = building.id;
        document.getElementById("building-year").textContent = building.year;
        document.getElementById("building-history").textContent = building.history;

        map.setView([building.lat, building.lng], 18);
      } else {
        document.getElementById("building-name").textContent = "Building Not Found";
        document.getElementById("building-description").textContent = "The scanned building ID does not match our records.";
      }
    })
    .catch(error => {
      console.error("Failed to fetch building data:", error);
      document.getElementById("building-name").textContent = "Error Loading Data";
      document.getElementById("building-description").textContent = "Please try again later.";
    });
} else {
  document.getElementById("building-name").textContent = "No Building ID Detected";
  document.getElementById("building-description").textContent = "Please scan a QR code to view building details.";
}

// Hide loader after map + content load
window.addEventListener("load", () => {
  document.getElementById("loader").style.display = "none";
});
