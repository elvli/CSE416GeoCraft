const express = require("express");
const cors = require('cors');
const mongoose = require("mongoose");
const path = require('path')
const AuthController = require('./controllers/auth-controller')


require("dotenv").config();
const PORT = process.env.PORT || 3001;
const app = express();

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
// app.use(express.json());
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
app.post('/register', AuthController.registerUser)
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