import express from 'express'
import { getAddresses,addAddress,deleteAddress,setDefaultAddress } from '../controllers/addressController.js'
import authMiddleware from '../middleware/authMiddleware.js';
const router=express.Router();
router.get('/',authMiddleware,getAddresses);
router.post('/add',authMiddleware,addAddress);
router.delete('/:id',authMiddleware,deleteAddress);
router.put('/',authMiddleware,setDefaultAddress);
export default router;