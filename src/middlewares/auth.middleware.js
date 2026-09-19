import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
    
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace(/^Bearer\s+/i, "");
        if(!token){
            throw new apiError(401,"Unauthorized request");
        }
        const decodedToken =  jwt.verify(token , process.env.ACCESS_TOKEN_SECERET)
    
        const user = await User.findById(decodedToken?._id).select("-password -refershToken");
        if(!user){
            //discuss about fornted in next vedio
            throw new apiError(401, "Invaild acces TOken")
        }
    
        req.user = user;
        next();
    } catch (error) {
        throw new apiError(401,"Invaild access tokken")
    }

})