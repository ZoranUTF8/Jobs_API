const User = require("../models/User")
const {
    BadRequestError
} = require("../errors")
const {
    StatusCodes
} = require("http-status-codes")
// pasword hashing
const bcrypt = require("bcryptjs");

const register = async (req, res) => {

    const {
        name,
        email,
        password
    } = req.body;

    //! option 1
    // if (!name || !email || !password) {
    //     throw new BadRequestError("Please provide your name,email and password.")
    // }
    /////////////////////////////
    //! option 2 is to use the mongoose errors

    const newUser = await User.create({
        ...req.body
    })

    res.status(StatusCodes.CREATED).json({
        newUser
    })
};

const login = async (req, res) => {
    res.send("login user")
}



module.exports = {
    register,
    login
}