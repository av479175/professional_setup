import { Router } from "express";

import {loginUser ,logout,registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";



const router = Router();
router.route("/register").post(
    upload.fields([
        {
            name : "avatar",
            maxCount : 1
        },{
            name : "coverImage",
            maxCount : 1
        }
    ]

    ),
    registerUser
);

router.route("/login").post(loginUser)
//secured routes
router.route("/logout").post(verifyJWT ,logout)

// router.route("/").get(
//     (req, res) => res.status(200).json({
//         message: "YOUR FRONTEND IS CONNECTEDD TO BACKEND"
//     })
// );


export default router