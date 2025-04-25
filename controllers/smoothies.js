import mongoose from 'mongoose'
import express from 'express'
import Smoothie from '../models/Smoothies.js'

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

router.get('/smoothies/new', (req, res) => {
    try {
      console.log('Smooth')
      return res.render('smoothies/new.ejs')
    }
    catch (error) {
      console.log(error)
    }
})

router.get('/smoothies/:smoothieId/edit', async (req, res, next) => {
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
    if (!mongoose.isValidObjectId(req.params.smoothieId)){
      return next()
    }


    const smoothie = await Smoothie.findById(req.params.smoothieId)


    if (!smoothie) return next()

      console.log(smoothie)

    return res.render('smoothies/show.ejs', {
      smoothie: smoothie
    })
  } catch (error) {
    console.log(error)
  }
})

router.post('/smoothies', async (req, res) => {
  try{
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


export default router