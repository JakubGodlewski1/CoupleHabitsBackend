// express.d.ts
import 'express';

declare module 'express' {
    interface Request {
        auth?: {
            userId: string,
            email: string,
        };
    }
}