import mongoose from "mongoose";
import { UserDbSchema } from "../../../types/user";
import { generateConnectionCode } from "../../lib/users/generateConnectionCode/generateConnectionCode";

const userSchema = new mongoose.Schema<UserDbSchema>({
    id: {
        type: String,
        required: false
    },
    avatar: {
        type: String,
        required: false,
        default: null
    },
    email: {
        type: String,
        required: false
    },
    partnerId: {
        type: String,
        ref: "User",
        required: false,
        default: null
    },
    connectionCode: {
        type: String
    },
    gameAccountId: {
        type: mongoose.Types.ObjectId,
        ref: "GameAccount",
        required: false,
        default: null
    }
}, { timestamps: true });

// Use Mongoose's pre-save middleware to assign a connection code before saving the document
userSchema.pre("save", async function (next) {
    const user = this as mongoose.Document & UserDbSchema;

    // Check if the connectionCode is already set
    if (!user.connectionCode) {
        user.connectionCode = await generateConnectionCode();
    }

    next();
});

export const userDb = mongoose.model("User", userSchema);
