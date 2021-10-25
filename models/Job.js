const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
    company: {
        type: String,
        required: [true, "Please provide company name"],
        maxlength: 50
    },
    position: {
        type: String,
        required: [true, "Please provide position name"],
        maxlength: 200
    },
    status: {
        type: String,
        enum: ['interview', 'declined', 'pending'],
        default: 'pending'
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, "Please provide user"]
    }
}, {
    //? add the createdAt": "2021-10-25T03:41:23.354Z",
    //? "updatedAt": "2021-10-25T03:41:23.354Z", to our documents
    timestamps: true
})

module.exports = mongoose.model("Job", JobSchema);