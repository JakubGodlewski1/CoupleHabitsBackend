// express.d.ts
import 'express';
import {UserDbSchema} from "./user.js";

declare global {
    namespace Express {
        export interface Request {
            auth?: {
                userId: string,
                sessionClaims:{
                    email: string,
                }
            };
        }

        export interface Locals {
            user: UserDbSchema,
            partner?: UserDbSchema
        }
    }
}
