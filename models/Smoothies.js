import mongoose from "mongoose"

const smoothieSchema = new mongoose.Schema({
    name: String,
    price: Number,
    description: String,
    ingredients: [String],
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
},
{
    timestamps: true
})

const Smoothie = mongoose.model('Smoothie', smoothieSchema)

export default Smoothie