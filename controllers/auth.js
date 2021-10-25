const User = require("../models/User");
//? pasword hashing
const bcrypt = require("bcryptjs");

//! custom imports
const {
    BadRequestError,
    UnauthenticatedError
} = require("../errors")
const {
    StatusCodes
} = require("http-status-codes")


//? route handlers
const register = async (req, res) => {

    const {
        name,
        email,
        password
    } = req.body;

    //! option 1
    //? if (!name || !email || !password) {
    //?     throw new BadRequestError("Please provide your name,email and password.")
    //? }

    //! option 2 is to use the mongoose errors and mongoose validation from the model 
    //? save new user to db
    const user = await User.create({
        ...req.body
    })
    //? create token with the model method
    const token = user.createJWT();

    //? send response
    res.status(StatusCodes.CREATED).json({
        user: {
            name: user.name
        },
        token
    })
};

const login = async (req, res) => {
    //? get user input
    const {
        email,
        password
    } = req.body;
    //? check input present
    if (!email || !password) {
        throw new BadRequestError("Please provide your email and password.")
    }
    //? query db
    const user = await User.findOne({
        email
    });

    //? check if user found
    if (!user) {
        throw new UnauthenticatedError("Invalid credentials!")
    }
    //? check password match
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
        throw new UnauthenticatedError("Invalid credentials!")
    }
    //? create user token and return it with the name
    const token = user.createJWT();
    res.status(StatusCodes.OK).json({
        user: {
            name: user.name
        },
        token
    });



}



module.exports = {
    register,
    login
}