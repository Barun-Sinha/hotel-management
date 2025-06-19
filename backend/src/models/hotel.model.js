import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema({
    //name , description, destination, image, rooms, price, rating, location
    name: {
        type: String,
        required: true,
    },
    destination: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    photos: {
        type: [String],
        default: [],
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
    },
    rooms: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
    }],
    cheapestPrice: {
        type: Number,
        required: true,
    },
},{timestamps: true})

const Hotel = mongoose.model("Hotel",hotelSchema);
export default Hotel;