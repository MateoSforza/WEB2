import {
  createUser,
  deleteUser,
  getUser,
  getUsers,
  updateUser,
  loginUser,
} from "../controllers/userController";
import express from "express";
import { validateDto } from "../middleware/validate-dto";


import { CreateUserDto } from "../dto/create-user.dto";
import { UpdateUserDto } from "../dto/update-user.dto";

const router = express.Router();

router.post("/", validateDto(CreateUserDto), createUser);
router.get("/", getUsers);
router.get("/:id", getUser);
router.delete("/:id", deleteUser);
router.put("/:id", validateDto(UpdateUserDto), updateUser);
router.post("/login", loginUser);

export default router;
