// auth, is student, is admin
const jwt=require("jsonwebtoken");


exports.auth = async (req, res, next) => {
    try{
        //extract token
        console.log("in")
        console.log(req.body.token )
        const token=req.body.token||req.cookies.token||req.header('Authorization').replace('Bearer ', '');

        //if token missing, then return response
        if(!token) {
            return res.status(401).json({
                success:false,
                message:'TOken is missing',
            });
        }

        //verify the token
        try{
            const decode =  jwt.verify(token, process.env.JWT_SECRET);
            console.log(decode);
            req.user = decode;
        }
        catch(err) {
            //verification - issue
            return res.status(401).json({
                success:false,
                message:'token is invalid',
            });
        }
        console.log("out")
        next();
    }
    catch(error) {  
        return res.status(401).json({
            success:false,
            message:'Something went wrong while validating the token',
        });
    }
}
