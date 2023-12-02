const auth = require('../auth')
const User = require('../models/user-model')
const bcrypt = require('bcryptjs')

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
    const { firstName, lastName, username, email, confirmEmail, password, confirmPassword, aboutMe } = req.body;
    console.log("auth-controller: ", req.body);
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
    const newUser = new User({ firstName, lastName, username, email, passwordHash, aboutMe });
    const savedUser = await newUser.save();

    // LOGIN THE USER
    const token = auth.signToken(savedUser._id);
    console.log("auth-controller: " + savedUser.aboutMe)

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
    console.log("updateUser: " + JSON.stringify(body));
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        _id: body._id,
        firstName: body.firstName,
        lastName: body.lastName,
        username: body.username,
        email: body.email,
        aboutMe: body.aboutMe,
      },
      { new: true, runValidators: true }
    )
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        error: 'User not found!',
      });
    }
    console.log("Updated User: " + JSON.stringify(updatedUser));
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

module.exports = {
  getLoggedIn,
  registerUser,
  loginUser,
  logoutUser,
  updateUser
}