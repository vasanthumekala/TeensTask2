import express from "express";
const router = express.Router();

import { registerUser, login } from "../controllers/user.controller.js";
import { adminPath } from "../controllers/admin.controller.js";
import { managerPath } from "../controllers/manager.controller.js";
import { employeePath } from "../controllers/employee.controller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

import { authorization } from "../middleware/roleMiddleware.js";

//authentication
router.post("/register", registerUser);
router.post("/login", login);

//role based access
router.get("/admin", authMiddleware, authorization("admin"), adminPath);
router.get("/manager",authMiddleware,authorization("admin", "manager"),managerPath,);
router.get("/employee",authMiddleware,authorization("admin", "manager", "employee"),employeePath,);

export default router;
