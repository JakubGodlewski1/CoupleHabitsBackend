import {NextFunction, Request, Response} from "express";
import {isProduction} from "../../utils/isProduction.js";

export let MOCK_DATE:(undefined | Date) = undefined

export const setMockDateForTests = (req:Request, res:Response, next:NextFunction) => {

    if (!isProduction){
        const mockDate = req.headers["x-mock-date"] as string | undefined;

        if (mockDate){
            MOCK_DATE = new Date(mockDate);
        }
    }

    next()
}