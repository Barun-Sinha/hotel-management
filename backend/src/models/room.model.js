import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    maxPeople: {
        type: Number,
        required: true,
    },
    photos: {
        type: [String],
        default: [],
    },
    roomNumbers: [{
        number: {
            type: Number,
            required: true,
        },
        unavailableDates: {
            type: [Date],
            default: [],
        },
    }],
    hotelId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hotel',
        required: true,
    },
}, { timestamps: true });

const Room = mongoose.model("Room",roomSchema);
export default Room;