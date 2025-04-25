// routes/smoothieRoutes.js
import mongoose from 'mongoose';
import express from 'express';
import Smoothie from '../models/Smoothies.js';
import isSignedIn from '../middleware/isSignedIn.js';

const router = express.Router()

router.get('/smoothies', async (req, res) => {
    try {
        const allsmoothies = await Smoothie.find()
        return res.render('smoothies/index.ejs', {
            Smoothies: allsmoothies
        })
    }
    catch(error) {
        console.log(error)
        res.status(500).redirect("404.ejs")
    }
})

router.get('/smoothies/new', isSignedIn, (req, res) => {
    try {
      console.log('Smooth')
      return res.render('smoothies/new.ejs')
    }
    catch (error) {
      console.log(error)
    }
})

router.get('/smoothies/:smoothieId/edit', isSignedIn, async (req, res, next) => {
    try {
      if (!mongoose.isValidObjectId(req.params.smoothieId)){
        console.log("good here")
        return next()
      }

      const smoothie = await Smoothie.findById(req.params.smoothieId)
  
      if (!Smoothie) return next()
   
  
      return res.render('smoothies/edit.ejs', {
        smoothie
      })
    } catch (error) {
      console.log(error)
    }
})

router.get('/smoothies/:smoothieId', async (req, res, next) => {
  try {
    // Check if the smoothieId is valid
    if (!mongoose.isValidObjectId(req.params.smoothieId)) {
      return next();  // This will call the next middleware (likely for a 404 handler)
    }

    // Find the smoothie by ID and populate the 'author' field
    const smoothie = await Smoothie.findById(req.params.smoothieId).populate('author');

    // If smoothie is not found, go to the next middleware (likely for a 404 handler)
    if (!smoothie) return next();

    const user = req.session.user;

    res.render('smoothies/show', { smoothie, user });

  } catch (error) {
    console.log(error);
    res.status(500).send('Something went wrong');
  }
})
router.post('/smoothies', async (req, res) => {
  try{
    req.body.author = req.session.user._id
    const { name, price, description, ingredients } = req.body;

    const ingredientsArray = ingredients
      .split(',')                // split by commas
      .map(item => item.trim()) // trim spaces around each ingredient
      .filter(item => item);    // remove any empty strings

      const newSmoothie = await Smoothie.create({ 
        name,
        price,
        description,
        ingredients: ingredientsArray
      });
      return res.redirect(`/smoothies/${newSmoothie._id}`);
  }
  catch(error){
      console.log(error.message)
      return res.status(422).render('smoothies/new.ejs',{
      errorMessage: error.message
      })
  }
})

router.put('/smoothies/:smoothieId', async (req, res) => {
  try {
    const smoothieId = req.params.smoothieId

    // Validate incoming smoothieId
    if (!mongoose.isValidObjectId(smoothieId)){
      return next()
    }

    
    const smoothie = await Smoothie.findById(smoothieId)

    const loggedInUserId = req.session.user._id
    const smoothieAuthor = smoothie.author

    if (!smoothieAuthor.equals(loggedInUserId)){
      return res.status(403).send('You do not permission to access this resource')
    }

    // Attempt to make the update for the smoothie
    const updatedSmoothie = await Smoothie.findByIdAndUpdate(smoothieId, req.body)

    // If smoothies not found, return 404
    if (!updatedSmoothie) return next()

    const { name, price, description, ingredients } = req.body;

    // Convert comma-separated ingredients string to array
    const ingredientsArray = ingredients.split(',').map(i => i.trim());

    await Smoothie.findByIdAndUpdate(req.params.smoothieId, {
      name,
      price,
      description,
      ingredients: ingredientsArray
    });

    res.redirect('/smoothies'); // Or wherever your smoothie list is
  } catch (error) {
    console.error(error);
    res.send('Something went wrong');
  }
});

router.delete('/smoothies/:smoothiesId', isSignedIn, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.smoothiesId)){
      return next()
    }
    await Smoothie.findByIdAndDelete(req.params.smoothiesId)
    return res.redirect('/smoothies')
  } catch (error) {
    console.log(error)
  }
})



export default router