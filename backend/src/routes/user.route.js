import express from "express";
const router = express.Router();

import { registerUser,login } from "../controllers/user.controller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
router.post("/register", registerUser);
router.post("/login", login);

export default router;
