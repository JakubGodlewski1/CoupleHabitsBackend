import {Router} from 'express';
import {getUser} from "../../../controllers/users/getUser/getUser.controller";
import {connectWithPartnerController} from "../../../controllers/users/connectWithPartner/connectWithPartner.controller";
import {hasNoPartner} from "../../../middleware/users/hasNoPartner/hasNoPartner.middleware";
import {hasConnectionCodeAndCurrentDate} from "../../../middleware/users/hasConnectionCodeAndCurrentDate/hasConnectionCodeAndCurrentDate.middleware";
import {partnerExists} from "../../../middleware/users/partnerExists/partnerExists.middleware";
import multer from "multer"
import {uploadAvatar} from "../../../controllers/users/uploadAvatar/uploadAvatar.controller";
import {validateAvatarFile} from "../../../middleware/users/validateAvatar/validateAvatar.middleware";
const storage = multer.memoryStorage()
const upload = multer({storage: storage})
export const userRouter = Router()

/*I don't use /id when it comes to user route because I use bearer token and fetch user id on the backend*/
userRouter.get("/", getUser)
userRouter.patch("/connect-with-partner", hasNoPartner, hasConnectionCodeAndCurrentDate, partnerExists, connectWithPartnerController)
userRouter.patch("/avatar",  upload.single('avatar'), validateAvatarFile,  uploadAvatar)