import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function authenticateJWT(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Token no proporcionado." });
    }

    const token = authHeader.split(" ")[1];

    try {
            const secret = process.env.JWT_SECRET || "secreto";
            const decoded = jwt.verify(token, secret);
            // Puedes guardar info del usuario en req.user si lo necesitas
            (req as any).user = decoded;
            next();
        } catch (err) {
            return res.status(401).json({ message: "Token inválido o expirado." });
    }
}