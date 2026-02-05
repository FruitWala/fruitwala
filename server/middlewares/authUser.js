import jwt from 'jsonwebtoken';

const authUser = async (req, res, next)=>{
    const token = req.cookies.token;

     // 🔍 DEBUG LOG 1
        console.log("COOKIE:", token);

    if(!token){
        return res.json({ success: false, message: 'User Not Authenticated' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 🔍 DEBUG LOG 2
        console.log("DECODED JWT:", decoded);
        
        req.userId = decoded.id;
        
        // 🔍 DEBUG LOG 3
        console.log("USER ID SET ON REQ:", req.userId);

        next();
    } catch (error) {
        console.log("❌ JWT ERROR:", error.message);
        res.json({ success: false, message: "User Not Authenticated" });
    }
};

export default authUser;