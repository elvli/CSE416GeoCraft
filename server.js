const express = require("express");
const cors = require('cors');
const mongoose = require("mongoose");
const AuthController = require('./controllers/auth-controller');
const MapController = require('./controllers/map-controller');
const MapDataController = require('./controllers/mapData-controller')
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const auth = require('./auth');
//const baseUrl = "https://geocraftmaps.azurewebsites.net";
 const baseUrl = "http://localhost:3000";

require("dotenv").config();
const PORT = process.env.PORT || 3001;
const app = express();

app.use(cors({
  origin: baseUrl,
  credentials: true,
}));

app.use(cookieParser())


app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', baseUrl);
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
app.put('/map/:id', auth.verify, MapController.updateMapById);
app.put('/maps/:id', auth.verify, MapController.updateUserFeedback);
app.get('/maps', auth.verify, MapController.getPublishedMaps);
app.put('/maps', auth.verify, MapController.updateMultipleMaps);

app.post('/mapData', auth.verify, MapDataController.createMapData);
app.delete('/mapData/:id', auth.verify, MapDataController.deleteMapData);
app.put('/mapData/:id', auth.verify, MapDataController.updateMapDataById);
app.get('/mapData/:id', MapDataController.getMapDataById);

app.listen(PORT, () => {
  console.log(`Server is running on post ${PORT}`);
});

module.exports = app;