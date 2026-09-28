const https = require("https");

const REQUEST_TIMEOUT_MS = 10000;
const MIN_REQUEST_INTERVAL_MS = 1000;
const inFlightRequests = new Map();
let lastRequestAt = 0;
let requestQueue = Promise.resolve();

function requestGeocoding(url) {
  return new Promise((resolve, reject) => {
    const request = https.get(
      url,
      {
        headers: {
          "User-Agent": "WanderLust/1.0 (listing location geocoding)",
        },
      },
      (response) => {
      let body = "";
      response.setEncoding("utf8");
      response.on("data", (chunk) => {
        body += chunk;
      });
      response.on("end", () => {
        if (response.statusCode < 200 || response.statusCode >= 300) {
          reject(
            new Error(`Geocoding service returned HTTP ${response.statusCode}.`),
          );
          return;
        }

        let data;
        try {
          data = JSON.parse(body);
        } catch {
          reject(new Error("Geocoding service returned an invalid response."));
          return;
        }

        const result = Array.isArray(data) ? data[0] : null;
        const latitude = result ? Number(result.lat) : NaN;
        const longitude = result ? Number(result.lon) : NaN;
        if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
          resolve(null);
          return;
        }

        resolve({ latitude, longitude });
      });
      },
    );

    request.setTimeout(REQUEST_TIMEOUT_MS, () => {
      request.destroy(new Error("Geocoding request timed out."));
    });
    request.on("error", reject);
  });
}

function queueGeocoding(url) {
  const request = requestQueue.then(async () => {
    const delay = Math.max(
      0,
      lastRequestAt + MIN_REQUEST_INTERVAL_MS - Date.now(),
    );
    if (delay > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
    lastRequestAt = Date.now();
    return requestGeocoding(url);
  });

  requestQueue = request.then(
    () => undefined,
    () => undefined,
  );
  return request;
}

module.exports = (location, country) => {
  const query = [location, country].filter(Boolean).join(", ").trim();
  if (!query) {
    return Promise.resolve(null);
  }

  const requestKey = query.toLowerCase();
  const existingRequest = inFlightRequests.get(requestKey);
  if (existingRequest) {
    return existingRequest;
  }

  const endpoint = new URL("https://nominatim.openstreetmap.org/search");
  endpoint.searchParams.set("q", query);
  endpoint.searchParams.set("format", "jsonv2");
  endpoint.searchParams.set("limit", "1");

  const request = queueGeocoding(endpoint);
  inFlightRequests.set(requestKey, request);
  request.then(
    () => inFlightRequests.delete(requestKey),
    () => inFlightRequests.delete(requestKey),
  );
  return request;
};
