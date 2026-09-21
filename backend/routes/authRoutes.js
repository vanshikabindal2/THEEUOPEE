import express from 'express';
import {
    sendOtp,verifyOtp,completeProfile,getMe,} from '../controllers/authController.js'
    import authMiddleware from '../middleware/authMiddleware.js'
    const router=express.Router();
    router.post("/send-otp",sendOtp);
    router.post("/verify-otp",verifyOtp)
    router.post("/complete-profile",completeProfile)
    router.get('/me',authMiddleware,getMe);
    export default router;

