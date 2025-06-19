import express from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { cancelBooking, createBooking, getUsersBooking } from "../controllers/booking.controller.js";

const router = express.Router();

//create a new booking
router.post('/book',verifyJWT,createBooking);


//cancel a booking
router.delete('/:bookingId/cancel',verifyJWT,cancelBooking)

//get all bookings of a user
router.get('/my-bookings', verifyJWT, getUsersBooking);


//get all bookings of a hotel


export default router;