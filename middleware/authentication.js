const User = require("../models/User");
const jwt = require("jsonwebtoken");
//? custom import
const {
    UnauthenticatedError
} = require("../errors");


const auth = async (req, res, next) => {
    //? check header
    const authHeader = req.headers.authorization;
    //? check header 
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new UnauthenticatedError("Authentication token invalid")
    }
    //? get the token aout of the header
    const token = authHeader.split(" ")[1];

    try {
        //? verify the token
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        //? attach the user to the job routes so we can acces them in req.user in the job handler
        req.user = {
            userId: payload.userId,
            name: payload.name
        }
        next();
    } catch (error) {
        throw new UnauthenticatedError("Authentication token invalid");
    }
}

module.exports = auth;