import {loadDotEnv} from "../lib/server/loadDotEnv";

loadDotEnv()

export const isProduction = process.env.NODE_ENV === "production";