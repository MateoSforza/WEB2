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

// Puedes guardar los refresh tokens en memoria (solo para pruebas, en producción usa BD)
let refreshTokens: string[] = [];

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Usuario o contraseña incorrectos." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Usuario o contraseña incorrectos." });
    }

    // Access token (10 min)
    const accessToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || "secreto",
      { expiresIn: "10m" }
    );

    // Refresh token (7 días)
    const refreshToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || "secreto",
      { expiresIn: "7d" }
    );

    refreshTokens.push(refreshToken);

    res.json({ accessToken, refreshToken });
  } catch (error) {
    res.status(500).json({ message: "Error en el login.", error });
  }
};

// Endpoint para refrescar el access token
export const refreshAccessToken = (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  if (!refreshToken || !refreshTokens.includes(refreshToken)) {
    return res.status(401).json({ message: "Refresh token inválido." });
  }

  try {
    const payload = jwt.verify(refreshToken, process.env.JWT_SECRET || "secreto") as any;
    const newAccessToken = jwt.sign(
      { userId: payload.userId, email: payload.email },
      process.env.JWT_SECRET || "secreto",
      { expiresIn: "10m" }
    );
    res.json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(401).json({ message: "Refresh token inválido o expirado." });
  }
};
