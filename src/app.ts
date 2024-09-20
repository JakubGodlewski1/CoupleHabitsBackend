import "express-async-errors"
import express from "express";
import morgan from "morgan"
import helmet from "helmet";
import {routerV1} from "./routers";
import {StatusCodes} from "http-status-codes";
import {errorHandler} from "./lib/server/errorHandler/errorHandler";
import {loadDotEnv} from "./lib/server/loadDotEnv";
import {startServerAndConnectWithDB} from "./lib/server/startServerAndConnectWithDB";

//app init
loadDotEnv()
const app = express();
const PORT = process.env.PORT || 3000;

//middleware
app.use(express.json());
app.use(morgan("dev"));
app.use(helmet());

//routers
app.use("/api/v1", routerV1)

//no found route
app.use("/api/v1/*", (req, res)=>{
    res.status(StatusCodes.NOT_FOUND).json({message: "The provided endpoint is not found"})
})

//error handler
app.use(errorHandler)

await startServerAndConnectWithDB(app, PORT)