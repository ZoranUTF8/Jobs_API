const Job = require("../models/Job");
const {
    StatusCodes
} = require("http-status-codes");
const {
    BadRequestError,
    NotFoundError
} = require("../errors");


const getAllJobs = async (req, res) => {
    //? get all jobs created by the same user 
    const jobs = await Job.find({
        createdBy: req.user.userId
    }).sort('createdAt');

    res.status(StatusCodes.OK).json({
        jobs,
        total: jobs.length
    })
};
const getJob = async (req, res) => {
    //? get user id and job id from the request.params and req.bdoy
    const {
        user: {
            userId
        },
        params: {
            id: jobId
        }
    } = req;

    //? query db with provided data
    const job = await Job.findOne({
        _id: jobId,
        createdBy: userId
    });
    //? check job
    if (!job) {
        throw new NotFoundError(`No job with provided id: ${jobId}`)
    }
    res.status(StatusCodes.OK).json({
        job
    });



};
const createJob = async (req, res) => {
    //? assign the user id to the created by property of the job model, we have the req.user.id from the middleware to authenticate
    req.body.createdBy = req.user.userId;

    const job = await Job.create(req.body);

    res.status(StatusCodes.CREATED).json(job)
};
const updateJob = async (req, res) => {
    //? get user id and job id from the request.params and req.bdoy
    const {
        user: {
            userId
        },
        params: {
            id: jobId
        },
        body: {
            company,
            position
        }
    } = req;

    //? check if body for new values are present
    if (company === "" || position === "") {
        throw new BadRequestError("Company or Position fields cannot be empty")
    }
    //? query db and update 
    const job = await Job.findOneAndUpdate({
        _id: jobId,
        createdBy: userId
    }, req.body, {
        new: true,
        runValidators: true
    })
    //? handle invalid job
    if (!job) {
        throw new NotFoundError(`No job with id: ${jobId}`)
    };
    //? send response
    res.status(StatusCodes.OK).json(job);
};
const deleteJob = async (req, res) => {
    //? get user id and job id from the request.params and req.bdoy
    const {
        user: {
            userId
        },
        params: {
            id: jobId
        }
    } = req;

    const job = await Job.findOneAndRemove({
        _id: jobId,
        createdBy: userId
    })

    //? handle invalid job
    if (!job) {
        throw new NotFoundError(`No job with id: ${jobId}`)
    };
    //? send response with job or without it
    //res.status(StatusCodes.OK).json(job) // with job returned
     res.status(StatusCodes.OK).send(); // only status returned
    
};





module.exports = {
    getAllJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob
}