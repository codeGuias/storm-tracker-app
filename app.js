const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = 3000;

// Windy API key (optional depending on how you integrate)
const windyApiKey = process.env.WINDY_API_KEY;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Home route to render the search page
app.get('/', (req, res) => {
    res.render('index');
});

// Post route to handle form submission and fetch storm data (geocode data)
app.post('/search', async (req, res) => {
    const country = req.body.country;
    const apiKey = process.env.API_KEY; // API key from environment

    try {
        // Fetch the geolocation data based on the country entered using Geocoding API
        const geoResponse = await axios.get(`http://api.openweathermap.org/geo/1.0/direct`, {
            params: {
                q: country,
                limit: 1, // Get the first match
                appid: apiKey
            }
        });

        const locationData = geoResponse.data[0];
        const { lat, lon } = locationData;

        // Log the location data for debugging
        console.log('Location Data:', locationData);

        // Pass the data to the result page to render the Windy map and storm info
        res.render('result', {
            country: country,
            lat: lat,
            lon: lon,
            locationData: locationData, // For additional weather details
            error: null
        });
    } catch (error) {
        // Log the error for debugging
        console.error('Error fetching location data:', error.response ? error.response.data : error.message);

        // Render the result page with an error message
        res.render('result', {
            country: country,
            lat: null,
            lon: null,
            locationData: null,
            error: 'No storm data or location found for the selected country. Please ensure the country name is correct.'
        });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
