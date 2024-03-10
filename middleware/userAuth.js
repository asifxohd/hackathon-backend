import jwt from 'jsonwebtoken';
import 'dotenv/config';

const userAuthentication = (req, res, next) => {
    try {
        console.log('Middle ware')
        const token = req.cookies.userToken;
        if (!token) {
            return res.status(401).json({ message: 'Access denied. Please Login.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.id;
        console.log(req.user)
        next();
    } catch (error) {
        return next(error);
    }
};

export default userAuthentication;
