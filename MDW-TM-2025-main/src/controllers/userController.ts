import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/userModel";

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, lastName, email, password, age } = req.body;

    // Verifica si el email ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "El email ya está registrado." });
    }

    // Hashea la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      lastName,
      email,
      password: hashedPassword,
      age,
    });

    await user.save();
    res.status(201).json({ message: "Usuario creado correctamente." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al crear usuario.", error });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);

    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    res.json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(id, req.body);

    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Busca el usuario por email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Usuario o contraseña incorrectos." });
    }

    // Compara la contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Usuario o contraseña incorrectos." });
    }

    // Genera el JWT (expira en 10 minutos)
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || "secreto", // Usa una variable de entorno en producción
      { expiresIn: "10m" }
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Error en el login.", error });
  }
};
