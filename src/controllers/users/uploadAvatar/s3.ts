import {DeleteObjectCommand, PutObjectCommand, S3Client} from "@aws-sdk/client-s3";
import {Request} from "express";
import sharp from "sharp";
import {loadDotEnv} from "../../../lib/server/loadDotEnv.js";
import {userDb} from "../../../models/users/user.model.js";
import {UserDbSchema} from "../../../../types/user.js";

loadDotEnv()

const s3BucketName=process.env.S3_BUCKET_NAME
const s3Location=process.env.S3_LOCATION
const s3AccessKey=process.env.AWS_ACCESS_KEY_ID
const s3SecretKey=process.env.AWS_SECRET_ACCESS_KEY

export const s3 = new S3Client(
    {
        credentials:{
            accessKeyId: s3AccessKey!,
            secretAccessKey: s3SecretKey!
        },
        region: s3Location,
    }
)

const params= async (req:Request, fileName:string) => {

    //edit image
    const buffer =await sharp(req.file?.buffer).resize({
        height: 512,
        width:512,
        fit: "cover"
    }).withMetadata().toBuffer()

    return {
    Bucket: s3BucketName,
    Key: fileName,
    Body: buffer,
    ContentType: req.file?.mimetype
}}

const uploadCommand = async (req:Request, fileName:string) => new PutObjectCommand(await params(req, fileName))
const deleteCommand = async (fileName:string) => new DeleteObjectCommand({
    Bucket: s3BucketName,
    Key: fileName,
})

const uploadImage = async (req:Request, user:UserDbSchema) => {
    const userId= user.id
    const fileName = `${userId}_${new Date().toISOString().replace(/[:.]/g, '-')}`;

    const uploadImg =await uploadCommand(req, fileName)
    await s3.send(uploadImg)
    if (user.avatar){
    await deleteCommand(user.avatar)
    }

    //generate url
    const url =`https://${s3BucketName}.s3.${s3Location}.amazonaws.com/${fileName}`

    //update user with the url link
    try {
        await userDb.findOneAndUpdate({id:userId}, {avatar: url} as UserDbSchema)
    }catch (err){
        const deleteImg = await deleteCommand(fileName)
        await s3.send(deleteImg)
        throw new Error("Something went wrong while uploading the image, try again later")
    }
}

export {uploadImage}