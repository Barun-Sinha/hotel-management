import express from 'express';
import { verifyAdmin, verifyJWT } from '../middleware/auth.middleware.js';
import { createHotel , updateHotel , deleteHotel , getAllHotels , getHotelByID , getHotelByDestination} from '../controllers/hotel.controller.js';


const router = express.Router();

//create a new hotel (onnly admin)
router.post('/create',verifyJWT,verifyAdmin,createHotel)

//update a hotel (only admin)
router.put('/:id',verifyJWT,verifyAdmin,updateHotel)

//delete a hotel (only admin)
router.delete('/:id',verifyJWT,verifyAdmin,deleteHotel)

//get all hotels
router.get('/', getAllHotels)

//get a single hotel by id along with its rooms
router.get('/:id', getHotelByID);

//get all hotels by city
router.get('/city/:name', getHotelByDestination);

export default router;