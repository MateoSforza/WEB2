import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Request, Response, NextFunction } from 'express';

export function validateDto<T>(dto: ClassConstructor<T>) {
    return async (req: Request, res: Response, next: NextFunction) => {
    const instance = plainToInstance(dto, req.body);
    const errors = await validate(instance as object, { whitelist: true });
    if (errors.length > 0) {
        return res.status(400).json({
        errors: errors.map(e => ({
        property: e.property,
        constraints: e.constraints
        }))
    });
    }
    req.body = instance;
    next();
    };
}
