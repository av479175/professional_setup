import { asyncHandler } from "../utils/asyncHandler.js"
import { apiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

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
    console.log("email", email);
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
    const existedUser = User.findOne({
        $or: [{
            username
        }, {
            email
        }]
    })
    if(existedUser){
        throw new apiError(409 , "USER already exist with this email");
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;
    if(!avatarLocalPath){
        throw  new apiError(400 , "AVATAR TOH LAGEGA BAHI");
    }
    //abhi baad m delete karunga
    const avatar = await uploadOnCloudinary(avatarLocalPath);

    const coverImage = await uploadOnCloudinary(coverImage);
    if(!avatar){
        throw  new apiError(400 , "AVATAR TOH LAGEGA BAHI dhekle");
    }

    User.create({
        fullName,
        avatar : avatar.url,
        coverImage : coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })
})



export { registerUser }