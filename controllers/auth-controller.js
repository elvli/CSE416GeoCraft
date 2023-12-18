const auth = require('../auth')
const User = require('../models/user-model')
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken")
const nodemailer = require('nodemailer');

getLoggedIn = async (req, res) => {
  try {
    let userId = auth.verifyUser(req);
    if (!userId) {
      return res.status(200).json({
        loggedIn: false,
        user: null,
        errorMessage: "?"
      })
    }

    const loggedInUser = await User.findOne({ _id: userId });
    return res.status(200).json({
      loggedIn: true,
      user: {
        _id: loggedInUser._id,
        firstName: loggedInUser.firstName,
        lastName: loggedInUser.lastName,
        email: loggedInUser.email,
        username: loggedInUser.username,
        aboutMe: loggedInUser.aboutMe,
        profilePicture: loggedInUser.profilePicture
      }
    })
  } catch (err) {
    res.json(false);
  }
}

loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ errorMessage: "Please enter all required fields." });
    }

    const existingUser = await User.findOne({ email: email });
    if (!existingUser) {
      return res
        .status(401)
        .json({
          errorMessage: "Wrong email or password provided."
        })
    }

    const passwordCorrect = await bcrypt.compare(password, existingUser.passwordHash);
    if (!passwordCorrect) {
      return res
        .status(401)
        .json({
          errorMessage: "Wrong email or password provided."
        })
    }

    // LOGIN THE USER
    const token = auth.signToken(existingUser._id);
    const expirationDate = new Date(Date.now() + (7 * 24 * 60 * 60 * 1000));

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      expires: expirationDate
    }).status(200).json({
      success: true,
      user: {
        _id: existingUser._id,
        firstName: existingUser.firstName,
        lastName: existingUser.lastName,
        email: existingUser.email,
        username: existingUser.username,
        aboutMe: existingUser.aboutMe,
        profilePicture: existingUser.profilePicture,
      }
    })

  } catch (err) {
    res.status(500).send();
  }
}

logoutUser = async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
    secure: true,
    sameSite: "none"
  }).send();
}

registerUser = async (req, res) => {
  try {
    const { firstName, lastName, username, email, confirmEmail, password, confirmPassword, aboutMe, profilePicture } = req.body;
    if (password.length < 8) {
      return res
        .status(400)
        .json({
          errorMessage: "Please enter a password of at least 8 characters."
        });
    }
    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({
          errorMessage: "Please enter the same password twice."
        })
    }
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res
        .status(400)
        .json({
          success: false,
          errorMessage: "An account with this email address already exists."
        })
    }
    const existingUsername = await User.findOne({ username: username });
    if (existingUsername) {
      return res
        .status(400)
        .json({
          success: false,
          errorMessage: "An account with this username already exists."
        })
    }

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const passwordHash = await bcrypt.hash(password, salt);
    const newUser = new User({ firstName, lastName, username, email, passwordHash, aboutMe, profilePicture });
    const savedUser = await newUser.save();

    // LOGIN THE USER
    const token = auth.signToken(savedUser._id);
    console.log("auth-controller: " + savedUser.aboutMe)
    console.log(savedUser.profilePicture)

    await res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none"
    }).status(200).json({
      success: true,
      user: {
        _id: savedUser._id,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        username: savedUser.username,
        email: savedUser.email,
        aboutMe: savedUser.aboutMe,
        profilePicture: savedUser.profilePicture
      }
    })

  } catch (err) {
    res.status(500).send();
  }
}

updateUser = async (req, res) => {
  try {
    let userId = auth.verifyUser(req);
    if (!userId) {
      return res.status(200).json({
        loggedIn: false,
        user: null,
        errorMessage: "?"
      })
    }
    const body = req.body.user;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        _id: body._id,
        firstName: body.firstName,
        lastName: body.lastName,
        username: body.username,
        email: body.email,
        aboutMe: body.aboutMe,
        profilePicture: body.profilePicture
      },
      { new: true, runValidators: true }
    )
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        error: 'User not found!',
      });
    }
    return res.status(200).json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: 'Internal Server Error',
    });
  }
}

createEmailLink = async (req, res) => {
  const email = req.body.email
  try {
    const user = await User.findOne({ email: email })
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found!',
      });
    }
    const secret = process.env.JWT_SECRET + user.passwordHash
    const token = jwt.sign({ email: user.email, id: user._id }, secret, { expiresIn: "5m" })
    const link = `http://localhost:3000/confirm/${user._id}/${token}`
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL,
        pass: process.env.GMAIL_PASSWORD
      }
    });

    var mailOptions = {
      from: process.env.GMAIL,
      to: email,
      subject: 'Verification Link',
      text: `Here's the link: ${link}`
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: 'Internal Server Error',
    });
  }
}

resetPassword = async (req, res) => {
  const id = req.body.id;
  const token = req.body.token
  const password = req.body.password;
  const user = await User.findOne({ _id: id })
  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'User not found!',
    });
  }
  const secret = process.env.JWT_SECRET + user.passwordHash
  try {
    jwt.verify(token, secret)
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: 'Unverified',
    });
  }

  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const passwordHash = await bcrypt.hash(password, salt);
  user.passwordHash = passwordHash;
  
  user.save()
    .then(() => {
      console.log('Password saved!')
      return res.status(201).json({
        success: true
      })
    })
    .catch(error => {
      return res.status(400).json({
        errorMessage: 'Password was not saved!'
      })
    })
}

verifyLink = async (req, res) => {
  const { id, token } = req.params
  const user = await User.findOne({ _id: id })
  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'User not found!',
    });
  }
  const secret = process.env.JWT_SECRET + user.passwordHash
  try {

    jwt.verify(token, secret)
    return res.status(200).json({
      success: true,
    });

  } catch (error) {
    console.error(error);
    return res.status(200).json({
      success: false,
    });
  }


}
module.exports = {
  getLoggedIn,
  registerUser,
  loginUser,
  logoutUser,
  updateUser,
  createEmailLink,
  resetPassword,
  verifyLink
}