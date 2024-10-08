import {Router} from 'express';
import {getUser} from "../../../controllers/users/getUser/getUser.controller.js";
import {connectWithPartnerController} from "../../../controllers/users/connectWithPartner/connectWithPartner.controller.js";
import {hasNoPartner} from "../../../middleware/users/hasNoPartner/hasNoPartner.middleware.js";
import {hasConnectionCodeAndUtcOffset} from "../../../middleware/users/hasConnectionCodeAndUtcOffset/hasConnectionCodeAndUtcOffset.middleware.js";
import {partnerExists} from "../../../middleware/users/partnerExists/partnerExists.middleware.js";
import multer from "multer"
import {uploadAvatar} from "../../../controllers/users/uploadAvatar/uploadAvatar.controller.js";
import {validateAvatarFile} from "../../../middleware/users/validateAvatar/validateAvatar.middleware.js";
const storage = multer.memoryStorage()
const upload = multer({storage: storage})
export const userRouter = Router()

/*I don't use /id when it comes to user route because I use bearer token and fetch user id on the backend*/
userRouter.get("/", getUser)
userRouter.patch("/connect-with-partner", hasNoPartner, hasConnectionCodeAndUtcOffset, partnerExists, connectWithPartnerController)
userRouter.patch("/avatar",  upload.single('avatar'), validateAvatarFile,  uploadAvatar)