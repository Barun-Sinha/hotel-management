import express from 'express';
import { createRoom , updateRoom , deleteRoom , getRoomById , getAllRooms, searchAvailableRooms , getRoomsByHotelId} from '../controllers/room.controller.js';
import { verifyAdmin, verifyJWT } from '../middleware/auth.middleware.js';


const router = express.Router();

//create a new room
router.post('/:hotelId',verifyJWT , verifyAdmin,  createRoom)

//update a room
router.put('/:id', verifyJWT , verifyAdmin,  updateRoom)

//delete a room and remove from hotel
router.delete('/:id/:hotelId',verifyJWT , verifyAdmin,  deleteRoom)

//get room by id
router.get('/:id', getRoomById)

//get all rooms
router.get("/", getAllRooms);

//get all rooms by hotel id
router.get('/byHotel/:hotelId', getRoomsByHotelId);

//get all the rooms after filtered by location, dates, and guests
router.get('/search', searchAvailableRooms);

export default router;