import { Request, Response } from "express";

export const getProducts = (req: Request, res: Response) => {
    res.json([
        { id: 1, name: "Producto 1", price: 100 },
        { id: 2, name: "Producto 2", price: 200 }
    ]);
};