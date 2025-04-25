import express from 'express'
import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import isSignedOut from '../middleware/isSignedOut.js'
import parser from '../middleware/parser.js'

const router = express.Router()

// ! Routes
// Sign up form page
router.get('/auth/sign-up', (req, res) => {
  try {
    return res.render('auth/sign-up.ejs', {
      errorMessage: ''
    })
  } catch (error) {
    console.log(error)
  }
})

// Sign in form page
router.get('/auth/sign-in', (req, res) => {
  try {
    return res.render('auth/sign-in.ejs', {
      errorMessage: ''
    })
  } catch (error) {
    console.log(error)
  }
})


// ? Create a user
// POST /auth/sign-up
router.post('/auth/sign-up', isSignedOut, parser.single('profileImage'), async (req, res) => {
  try {
    req.body.profileImage = req.file.path

    // Check passwords match, if not send error response
    if (req.body.password !== req.body.passwordConfirmation) {
      return res.status(422).render('auth/sign-up.ejs', {
        errorMessage: 'Your passwords do not match.'
      })
    }

    // Hash the password prior to creation of user
    req.body.password = bcrypt.hashSync(req.body.password, 12)

    // Create a new user
    const newUser = await User.create(req.body)

    return res.redirect('/auth/sign-in')
  } catch (error) {
    console.log(error.message)

    // Check for a duplicate key error
    if (error.code === 11000) {
      const fieldName = Object.keys(error.keyValue)[0]
      // Re-render the sign up form with errors if they occur
      return res.status(422).render('auth/sign-up.ejs', {
        errorMessage: `That ${fieldName} already exists`
      })
    }

    return res.status(400).render('auth/sign-up.ejs', {
      errorMessage: error.message
    })
  }
})

// ? Sign in user
router.post('/auth/sign-in', isSignedOut, async (req, res) => {
  console.log(req.body)
  try {
    // We want to locate a user in the database with an email matching the req.body.email (the email passed in the form)
    const foundUser = await User.findOne({ email: req.body.email })

    // Check if user was found, if not, render the form again with an unauthorized error message
    if (!foundUser) {
      console.log('User was not found')
      return res.status(401).render('auth/sign-in.ejs', {
        errorMessage: 'Unauthorized'
      })
    }

    // Check if the password given when submitting the form matches the password we have on file (check the hash against the provided plain text password)
    if (!bcrypt.compareSync(req.body.password, foundUser.password)) {
      // Passwords did not match!
      console.log('Passwords do not match')
      return res.status(401).render('auth/sign-in.ejs', {
        errorMessage: 'Unauthorized'
      })
    }

    // Sign the user in by adding the user details to the req.session
    // A cookie will then be returned to the client in the response
    // We'll later be able to view this session cookie to identify the user who is authenticated

    req.session.user = {
      username: foundUser.username,
      email: foundUser.email,
      _id: foundUser._id,
      profileImage: foundUser.profileImage
    }

    req.session.save(() => {
      return res.redirect('/smoothies')
    })


  } catch (error) {
    console.log(error)
  }
})

// ? Sign out user
router.get('/auth/sign-out', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/auth/sign-in')
  })
})



export default router