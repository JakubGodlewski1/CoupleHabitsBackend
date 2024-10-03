import { nightReset } from 'controllers/nightReset/nightReset.controller';
import {Router} from 'express';

export const nightResetRouter = Router();

nightResetRouter.get("/", nightReset)