# TravalBandhu

TravalBandhu is a travel-stay listing web application built with Node.js, Express, EJS, MongoDB, and Mongoose. Users can browse and search stays, create accounts, publish listings, and leave reviews.

## Features

- Account registration and login with Passport
- Create, edit, and delete travel listings
- Cloudinary image uploads
- Listing reviews and ratings
- Listing search and category filters
- Optional display of nightly prices including 18% GST
- Leaflet maps with OpenStreetMap tiles and stored listing coordinates
- Light and dark themes

## Requirements

- Node.js 18 or later
- MongoDB database (local or MongoDB Atlas)
- Cloudinary account for listing image uploads

## Local setup

1. Clone the repository and install dependencies:

   ```sh
   npm install
   ```

2. Copy `.env.example` to `.env` and fill in your own credentials.

3. Start the application:

   ```sh
   node app.js
   ```

4. Open [http://localhost:8080](http://localhost:8080).

## Environment variables

| Variable | Description |
| --- | --- |
| `ATLASDB_URL` | MongoDB connection string |
| `CLOUD_NAME` | Cloudinary cloud name |
| `CLOUD_API_KEY` | Cloudinary API key |
| `CLOUD_API_SECRET` | Cloudinary API secret |
| `SESSION_SECRET` | Secret used to sign session cookies |

Keep `.env` and real credentials private. For deployment, configure these values in your hosting provider's environment settings. The map geocoder uses OpenStreetMap Nominatim and does not require a geocoding API key.

## Listing categories

Choose a category when creating or editing a listing. Existing listings without a category remain visible in **All stays** and can be assigned a category by editing them.

## Deployment

Configure all environment variables in the hosting platform and allow the app to connect to MongoDB Atlas and Cloudinary. The application currently listens on port `8080`; update it to use the platform-provided `PORT` if your host requires a dynamic port.
