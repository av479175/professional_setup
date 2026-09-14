import { v2 as cloudinary } from "cloudinary";
import { log } from "console";
import fs from "fs";

// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUNDINARY_CLOUD_NAME,
    api_key: process.env.CLOUNDINARY_API_KEY,
    api_secret: process.env.CLOUNDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath)=>{
    try {
        if(!localFilePath){
            //there is not file path exist
            console.log('file path do not exist');
            return null;
        }
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath , {
            resource_type : "auto"
        } )
        //file has been uplaoded successfully
        // console.log("file is upladed to cloudinary ", response.url);
        //public url to upladed file
        fs.unlinkSync(localFilePath);
        //error aya toh bhi remove hojayegi to success par bhi
        return response;
    }catch (err){
        fs.unlinkSync(localFilePath); // remove the loacally saved file as the uplaod operation got failed
        return null;
    }
}

export {uploadOnCloudinary}