const bcrypt=require("bcryptjs");
const User=require("../models/User");
const jwt=require("jsonwebtoken");
require("dotenv").config();

// login routes handler

exports.login = async (req, res) => {
	try {
		// Get email and password from request body
		const { email, password } = req.body;

		// Check if email or password is missing
		if (!email || !password) {
			// Return 400 Bad Request status code with error message
			return res.status(400).json({
				success: false,
				message: `Please Fill up All the Required Fields`,
			});
		}

		// Find user with provided email
		const user = await User.findOne({ email });

		// If user not found with provided email
		if (!user) {
			// Return 401 Unauthorized status code with error message
			return res.status(401).json({
				success: false,
				message: `User is not Registered with Us Please SignUp to Continue`,
			});
		}

		// Generate JWT token and Compare Password
		if (await bcrypt.compare(password, user.password)) {
			const token = jwt.sign(
				{ email: user.email, id: user._id, accountType: user.accountType },
				process.env.JWT_SECRET,
				{
					expiresIn: "24h",
				}
			);

			// Save token to user document in database
			user.token = token;
			user.password = undefined;
			// Set cookie for token and return success response
			const options = {
				expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
				httpOnly: true,
			};
			res.cookie("token", token, options).status(200).json({
				success: true,
				token,
				user,
				message: `User Login Success`,
			});
		} else {
			return res.status(401).json({
				success: false,
				message: `Password is incorrect`,
			});
		}
	} catch (error) {
		console.error(error);
		// Return 500 Internal Server Error status code with error message
		return res.status(500).json({
			success: false,
			message: `Login Failure Please Try Again`,
		});
	}
};
// siqnup routes handler
exports.signup=async(req,res)=>{
    try{
        // get data
     const {name,email,password,confirmPassword}=req.body;
     //check if user already exits
     if (
        !name ||
        !email ||
        !password||
        !confirmPassword
        
     ){
        return res.status(403).send({
            success: false,
            message: "All Fields are required",
        });
     }
     if (password !== confirmPassword) {
        return res.status(400).json({
            success: false,
            message:
                "Password and Confirm Password do not match. Please try again.",
        });
    }
     const exitinguser= await User.findOne({email});
     if(exitinguser){
        return res.status(400).json({
            success:false,
            message:"User already exits"
        });
     }

     //secure password
     let hashedpass;
     try{
        hashedpass=await bcrypt.hash(password,10);

     }
     catch(err){
        return req.status(500).json({
            success:false,
            message:'error in hashing passw'
        });
     }

     // create entry for user

     const user=await User.create({
        name,email,password:hashedpass
     })
     

     return res.status(200).json({
        success:true,
        user:user,
        message:"User create successfully"
     })
    }
    catch(error){
       console.error(error);
       return res.status(500).json({
        success:false,
        message:"please try again later"
       });

    }
}