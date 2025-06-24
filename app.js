require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

const PORT = 3000;


app.use(express.urlencoded({ extended: true })); // to parse form data
app.set('view engine', 'ejs');


app.get('/', (req, res) => {
  res.render('index');
});


app.post('/check-sunscreen', async (req, res) => {
  const { latitude, longitude } = req.body;

  
  if (!latitude || !longitude) {
    return res.render('result', { error: 'Please give both latitude and longitude.', data: null });
  }

  try {
    
    const response = await axios.get('https://api.openuv.io/api/v1/uv', {
      params: { lat: latitude, lng: longitude },
      headers: { 'x-access-token': process.env.OPENUV_API_KEY }
    });

    const uvIndex = response.data.result.uv;

    const needSunscreen = uvIndex > 3;

    res.render('result', { error: null, data: { uvIndex, needSunscreen } });
  } catch (error) {
    console.error(error);
    res.render('result', { error: 'Failed to fetch data from Open UV API.', data: null });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:3000`);
});
