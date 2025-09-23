import express from "express";
import { registerUser, loginUser, getUserData, getCars } from "../controllers/userController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/get-user", getUserData);
router.get("/cars", getCars);

export default router;
