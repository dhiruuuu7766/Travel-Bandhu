const mapElement = document.getElementById("listing-map");

if (mapElement && !window.L) {
  const message = document.createElement("p");
  message.className = "listing-map-message";
  message.setAttribute("role", "status");
  message.textContent =
    "The interactive map couldn't be loaded. Please check your connection and try again.";
  mapElement.replaceWith(message);
} else if (mapElement) {
  const latitude = Number(mapElement.dataset.latitude);
  const longitude = Number(mapElement.dataset.longitude);

  if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
    const map = L.map(mapElement, {
      scrollWheelZoom: false,
    }).setView([latitude, longitude], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
    }).addTo(map);

    const popupContent = document.createElement("div");
    const title = document.createElement("strong");
    const location = document.createElement("div");
    title.textContent = mapElement.dataset.title;
    location.textContent = mapElement.dataset.location;
    popupContent.append(title, location);

    L.marker([latitude, longitude])
      .addTo(map)
      .bindPopup(popupContent)
      .openPopup();

    window.setTimeout(() => map.invalidateSize(), 0);
  }
}
