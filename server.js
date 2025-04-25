import express from "express"
import morgan from "morgan"
import mongoose from "mongoose"
import "dotenv/config"
import methodOverride from "method-override"
import session from "express-session"
import MongoStore from "connect-mongo"


import Smoothie from './models/Smoothies.js';
import SmoothiesRouter from './controllers/smoothies.js'

import User from "./models/User.js"
import router from "./controllers/auth.js"

import passUserToView from "./middleware/passUserToView.js"

const app = express()
const port = process.env.PORT || 3000

app.use(methodOverride('_method'))
app.use(express.urlencoded())
app.use(morgan('dev'))
app.use(express.static('public'))
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI
    })
}))
app.use('/', router)
app.use(passUserToView)


app.get('/', async (req, res) => {
    try {
        const allSmoothies = await Smoothie.find();
        res.render('index.ejs', { smoothies: allSmoothies });
    }
    catch (error) {
        console.log(error);
        res.status(500).send('Something went wrong');
    }
});
app.use ('/', SmoothiesRouter)

app.get('/{*any}', (req, res) =>{
    return res.status(404).render('404.ejs')
})


async function startServers() {
    try{
        await mongoose.connect(process.env.MONGODB_URI)
        console.log(`🔒 Database connection established`)

        app.listen(port, () => {
            console.log(`listening on port ${port}`)
        })
     } 
    catch (error) {
            console.log(error)
    }
}
startServers()