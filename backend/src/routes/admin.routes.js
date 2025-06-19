import express from 'express';
import { verifyAdmin, verifyJWT } from '../middleware/auth.middleware.js';
import { deleteUser, getAllAdmins, getAllUsers, addUser } from '../controllers/admin.controller.js'; 

const router = express.Router();

router.use(verifyJWT,verifyAdmin)

//get all users (not admin)
router.get('/users', getAllUsers)

//get all admins
router.get('/admins', getAllAdmins)

//delete user by id
router.delete('/users/:id', deleteUser)

//add user
router.post('/users', addUser)

// add hotel
//add room

export default router;