import {loadDotEnv} from "../lib/server/loadDotEnv.js";

loadDotEnv()

export const isProduction = process.env.NODE_ENV === "production";