import mongoose, {ClientSession} from "mongoose";

export const withTransaction = async (transactionFunction: (session:ClientSession)=>Promise<void>) => {
    const session = await mongoose.startSession()
    session.startTransaction()
    try{
        await transactionFunction(session)
        await session.commitTransaction()
    }catch(err:any){
        console.log(err)
        await session.abortTransaction()
        if (err.statusCode){
            class CustomError extends Error{
                statusCode = err.statusCode
            }
            throw new CustomError(err.message || "Something went wrong, try again later")
        }
        throw new Error("Something went wrong, try again later")
    }finally {
        await session.endSession()
    }
}