import { Router } from "express";
import {
  getUserByCity,
  assignTaskToUser,
} from "../controllers/moderatorcontrollers.js";
const router = Router();

router.get("/users", getUserByCity);
router.post("/assign", assignTaskToUser);

export default router;
