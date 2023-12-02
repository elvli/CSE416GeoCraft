const express = require("express");
const cors = require('cors');
const mongoose = require("mongoose");
const AuthController = require('./controllers/auth-controller');
const MapController = require('./controllers/map-controller');
const MapDataController = require('./controllers/mapData-controller')
const cookieParser = require('cookie-parser');
const auth = require('./auth');

require("dotenv").config();
const PORT = process.env.PORT || 3001;
const app = express();

app.use(cors({
  origin: "https://geocraftmaps.azurewebsites.net",
  // origin: "http://localhost:3000",
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser())

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://geocraftmaps.azurewebsites.net');
  //res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("DATABASE IS CONNECTED..."))
  .catch((err) => console.log(err));

// Routes
app.get('/loggedIn', AuthController.getLoggedIn);
app.post('/login', AuthController.loginUser);
app.get('/logout', AuthController.logoutUser);
app.post('/register', AuthController.registerUser);
app.put('/user/:id', AuthController.updateUser);

app.post('/map', auth.verify, MapController.createMap);
app.delete('/map/:id', auth.verify, MapController.deleteMap);
app.get('/map/:id', MapController.getMapById);
app.get('/mapPairs', MapController.getMapPairs);
app.post('/map', auth.verify, MapController.getMaps);
app.put('/map/:id', auth.verify, MapController.updateMap);
app.put('/maps/:id', auth.verify, MapController.updateUserFeedback);
app.get('/maps', auth.verify, MapController.getPublishedMaps);

app.post('/mapData', auth.verify, MapDataController.createMapData);
app.delete('/mapData/:id', auth.verify, MapDataController.deleteMapData);

app.listen(PORT, () => {
  console.log(`Server is running on post ${PORT}`);
});

module.exports = app;