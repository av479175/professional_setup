import multer from "multer";

//its a middleware

const storage = multer.diskStorage({
	// Choose the folder where uploaded files will be stored.
	destination: function (req, file, cb) {
		cb(null, "./public/temp");
	},

	// Give each uploaded file a unique name while keeping its original extension.
	filename: function (req, file, cb) {
		// const uniqueName = `${Date.now()}-${file.originalname}`;
		cb(null, file.originalname);
	}
});


const upload = multer({ storage });

export { upload };