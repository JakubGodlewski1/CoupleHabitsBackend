import { nightReset } from 'controllers/nightReset/nightReset.controller.js';
import {Router} from 'express';

export const nightResetRouter = Router();

nightResetRouter.get("/", nightReset)