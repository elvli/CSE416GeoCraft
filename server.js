const express = require("express");
const cors = require('cors');
const mongoose = require("mongoose");
// const path = require('path')
const AuthController = require('./controllers/auth-controller')
const MapController = require('./controllers/map-controller')
const cookieParser = require('cookie-parser')
const auth = require('./auth')


require("dotenv").config();
const PORT = process.env.PORT || 3001;
const app = express();

app.use(cors({
  origin: "https://geocraftmaps.azurewebsites.net",
  credentials: true,
}));

// app.use(express.urlencoded({ extended: true }))
// app.use(cors({
//     origin: ["http://localhost:3000"],
//     credentials: true
// }))

// http://localhost:3001
// https://geocraftmaps.azurewebsites.net
// https://geocraftserver.azurewebsites.net
// app.use(cors({
//     origin: ["https://geocraft-backend.onrender.com"],
//     credentials: true,
//     allowedHeaders: true,
//     methods: 'GET,PUT,POST,DELETE',
// }))
app.use(express.json());
app.use(cookieParser())

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://geocraftmaps.azurewebsites.net');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("DATABASE IS CONNECTED..."))
  .catch((err) => console.log(err));


// Auth routes
// const authRouter = require('./routes/auth-router')
// app.use('/auth', authRouter)
app.get('/loggedIn', AuthController.getLoggedIn)
app.post('/login', AuthController.loginUser)
app.get('/logout', AuthController.logoutUser)
app.get('/register', AuthController.registerUser)

app.post('/map', auth.verify, MapController.createMap)
app.delete('/map/:id', auth.verify, MapController.deleteMap)
app.get('/map/:id', auth.verify, MapController.getMapById)
app.get('/mapPairs', MapController.getMapPairs)
app.post('/map', auth.verify, MapController.getMaps)
app.put('/map/:id', auth.verify, MapController.updateMap)
app.put('/maps/:id', auth.verify, MapController.updateUserFeedback)
app.get('/maps', auth.verify, MapController.getPublishedMaps)
// app.get("/get-users", (req, res) => {
//   User.find()
//     .then((users) => res.json(users))
//     .catch((err) => console.log(err));
// });

// app.post("/create", (req, res) => {
//   //save to mongodb and send response
//   const newUser = new User({
//     name: req.body.name,
//     lastName: req.body.lastName,
//   });

//   newUser
//     .save()
//     .then((user) => res.json(user))
//     .catch((err) => console.log(err));
// });
// app.use(express.static('./client/build'))

// app.get('*', (req,res) =>{
//   res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
// })

app.listen(PORT, () => {
  console.log(`Server is running on post ${PORT}`);
});

module.exports = app;