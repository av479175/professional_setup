import { asyncHandler } from "../utils/asyncHandler.js"
import { apiError } from "../utils/apiError.js";
import User from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiRespone.js";
import jwt from JsonWebTokenError;
import { JsonWebTokenError } from "jsonwebtoken";
import { use } from "react";
//lets make a method for this
const generateAccessTokenAndRefershTokens = async (userID) => {
    try {
        const user = await User.findById(userID);
        const accessToken = user.generateAccessToken();
        const refershToken = user.generateRefershToken();

        user.refershToken = refershToken;
        await user.save({ validateBeforeSave: false });
        //har baar save karane par mongoose k model kickin hojate hai -> jaise pass required field hai toh harr bar hona chaiye

        //accees tokken ko database m store nahi karate hai
        return { accessToken, refershToken };
    } catch (error) {
        throw new apiError(500, "something went wrong while generating tokkens");
    }

};


const registerUser = asyncHandler(async (req, res) => {
    //steps - get user detail from user
    //vaildation-> not emptiness
    //check if user already exist : usernmae or email
    //files ?  images , check for avatar
    //upload them to cloudinary , check again avatar check
    //create  user obejct  - create entry in db
    //remove password and refersh tokken field from response
    //check if user is  created succesfully
    //return response
    const { fullName, email, username, password } = req.body
    // console.log("email", email);
    // if(fullName===""){
    //     throw new apiError(400 , "Full Name is required");
    // }
    if (
        [fullName, email, username, password].some((field) =>
            field?.trim() === ""
        )
    ) {
        throw new apiError(400, "All fields are required")
    }
    const existedUser = await User.findOne({
        $or: [{
            username
        }, {
            email
        }]
    })

    if (existedUser) {
        throw new apiError(409, "USER already exist with this email");
    }

    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage?.[0]?.path;
    let coverImageLocalPath;

    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }
    if (!avatarLocalPath) {
        throw new apiError(400, "AVATAR TOH LAGEGA BAHI");
    }
    //abhi baad m delete karunga
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    if (!avatar) {
        throw new apiError(400, "AVATAR TOH LAGEGA BAHI dhekle");
    }
    //cover can be null
    const coverImage = coverImageLocalPath
        ? await uploadOnCloudinary(coverImageLocalPath)
        : null;

    const user = await User.create({
        fullname: fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    });
    const createUser = await User.findById(user._id).select(
        "-password -refershToken"
    )
    if (!createUser) {
        throw new apiError(500, "something went wrong while registering");
    }
    return res.status(201).json(
        new ApiResponse(200, createUser, "user is regiestered successfully")
    );
})

const loginUser = asyncHandler(async (req, res) => {
    //req->body se data
    //username or email
    //validation
    //find the user
    //it should present in database storge
    //password check
    //if logged in successfully -> provide access tokken and refresh tokken
    //send cookies
    const { email, username, password } = req.body;
    if (!(username || email)) {
        throw new apiError(400, "username or email is required");
    }
    const user = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (!user) {
        throw new apiError(404, "user does not exist");
    }
    const isPasswordVaild = await user.isPasswordCorrect(password);
    if (!isPasswordVaild) {
        throw new apiError(404, "Invaild credentials");
    }
    //token system
    const { accessToken, refershToken } = await generateAccessTokenAndRefershTokens(user._id);

    //refresh tokken ka acces alag se bhi hai
    const loggedInUser = await User.findById(user._id).select("-password -refreshtoken");
    //select is user for not obtaining the field we don't want

    //by default cookie ko koi bhi modify kar sakta hai forntend pe

    const options = {
        httpOnly: true,
        secure: true, //only modify by server
        path: "/"
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refershToken", refershToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser, accessToken,
                    refershToken
                },
                "user logged in successfully"
            )
        );
}
);
const logout = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(

        req.user._id,
        {
            $set: {
                refershToken: undefined
            }
        },
        {
            new: true //jo apko response milega usme new updated value milegi
        }
    );

    const options = {
        httpOnly: true,
        secure: true,
        expires: new Date(0),
        path: "/"
    };
    return res.
        status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refershToken", options)
        .json(
            new ApiResponse(200, {}, "User Logged off")
        );
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refershToken || req.body.refershToken;
    if (incomingRefreshToken) {
        throw new apiError(401, "unauthorized request");
    }
    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.nextTick.REFRESH_TOKEN_SECRET
        );
    
        const user = await User.findById(decodedToken?._id)
    
        if (!user) {
            throw new apiError(401, "Invalid  Refresh tokken");
        }
    
        if (incomingRefreshToken != user?.refershToken) {
            throw new apiError(401, "Refresh tokken expired or used");
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const { accessToken, newrefershToken } = await generateAccessTokenAndRefershTokens(user._id);
    
        return res
            .status(200)
            .cookie("accesstoken", accessToken, options)
            .cookie("refershToken", newrefershToken, options)
            .json(
                new ApiResponse(
                    200,
                    {
                        accessToken, 
                        refershToken: newrefershToken,
                    },
                    "Access token refreshed"
                )
            )
    } catch (error) {
        throw new apiError(401 , error?.message || 
            "invalid refresh tokken"
        )
    }
});



export {
    registerUser,
    loginUser,
    logout,
    refreshAccessToken
}