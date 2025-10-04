import jwt from "jsonwebtoken"
import {asyncHandler} from '../utility/AsyncHandler.js'
import {ApiError} from '../utility/ApiError.js'
import { User } from "../models/user.model.js"
export const verifyJwt = asyncHandler(async(req,res,next)=>{
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
        if(!token){
            throw new ApiError(401,"Unauthorised Access")
        }
        const decodedToken = jwt.verify(token,process.env.JWT_SECRET)
        if(!decodedToken){
            throw new ApiError(401,"Token is expired or used")
        }
        const user = await User.findById(decodedToken?.id).select("-password -refreshToken")
        if(!user){
            throw new ApiError(400,"Invalid Access Token")
        }
        req.user = user
        next()
    } catch (error) {
        throw new ApiError(404,error?.message||"Invalid Access Token")
    }
})