import express from 'express'
import User from '../models/User.js'
import Smoothie from '../models/Smoothies.js'

const router = express.Router()

router.get('/profile', async (req, res, next) => {
  try {
    // Get all authored smoothies
    const authoredSmoothies = await Smoothie.find({ author: req.session.user._id })

    // Get all liked smoothies
    const likedSmoothies = await Smoothie.find({ likes: req.session.user._id })

    // Render
    return res.render('users/profile.ejs', {
      authoredSmoothies,
      likedSmoothies
    })
  } catch (error) {
    console.log(error)
  }
})


export default router