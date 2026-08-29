import { Router } from "express";

import {
  signUp,
  signIn,
  getMe,
  forgotPswd,
  resetPswd,
} from "../controller/authController.js";

import { middlewareToProtect } from "../middlewares/authMiddleware.js";

const router = Router();


// Public routes
router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/forgot-password", forgotPswd);
router.post("/reset-password", resetPswd);


// Protected route
router.get("/me", middlewareToProtect, getMe);


export default router;