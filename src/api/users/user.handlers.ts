import {Request, Response, NextFunction} from 'express';
import * as userService from './user.service';
import MessageResponse from '../../interfaces/MessageResponse';
import {UserList, UserLogin, UserLoginResponse} from '../../interfaces/UsersResponse';
import {ParamsWithId} from '../../interfaces/paramsWithId';
import {
    insertUserSchemaWithInviteCode,
    insertUserSchema,
    selectUserSchema,
    baseInsertUserSchema,
    updateUserSchema
} from './user.schema';
import { NewInvite } from '../../interfaces/NewInviteResponse';


export const registerUserHandler = async (req: Request<{}, MessageResponse, insertUserSchemaWithInviteCode>, res: Response<MessageResponse>, next: NextFunction) => {
    const inviteCode = req.body.invitedCode;
    const inviteObj = await userService.findInviteByuid(inviteCode);


    if (!inviteObj) {
        return res.status(404).json({
            "message": "Invalid Invite Code"
        });
    }

    const newUser : baseInsertUserSchema = {
        email: req.body.email,
        // no new admins can register
        isAdmin: false,
        fullName: req.body.fullName,
        password: req.body.password,
    };

    const isCreated = await userService.addUser(newUser, inviteObj);

    if (!isCreated) {
        
        return res.status(409).json({
            message: 'User Already Exists'
        });

    }

    return res.json({
        message: 'User Created Successfully'
    })

}

export const userListHandler = async (req: Request, res: Response<UserList|MessageResponse>, next: NextFunction) => {

    if (!req.user?.isAdmin){
        return res.json({
            message: "Invalid Action"
        }).status(401);
    }

    return res.json({
        users: await userService.getAllUsers()
    })
}


export const deleteUserHandler = async (req: Request, res: Response<MessageResponse>, next: NextFunction) => {

    if (!req.user?.isAdmin){
        return res.json({
            message: "Invalid Action"
        }).status(401);
    }

    const params = ParamsWithId.parse(req.params);

    const userId = params.id;
    const delRes = userService.deleteById(userId);

    if (!delRes)
        return res.json({
            message: 'User doesnt exist',
        })

    return res.json({
        message: 'User deleted successfully',
    })

}

export const loginUserHandler = async (req: Request<{}, MessageResponse|UserLoginResponse, UserLogin>, res: Response<MessageResponse|UserLoginResponse>, next: NextFunction) => {
    
    const userResponse = await userService.login(req.body.email, req.body.password)
    
    if (userResponse == null) {
        return await res.status(401).json({
        "message": "Invalid Credentials"
    })
}

    return res.json(userResponse);
}

export const userDetailsHandler = async (req: Request, res: Response<selectUserSchema|MessageResponse>, next: NextFunction) => {

    if (!req.user){
        return res.json({
            message: "Invalid Action"
        }).status(401);
    }

    return res.json({
        ...req.user
    })    

}

export const newInviteCodeHandler = async (req: Request, res: Response<NewInvite|MessageResponse>, next: NextFunction) => {
    
    if (!req.user){
        return res.status(401).json({
            message: "Invalid Action"
        })
    }

    const inviteCode =  await userService.genNewInviteCode(req.user);

    return res.json({
        inviteCode: inviteCode
    })
}

export const updateUserHandler = async (req: Request<{}, MessageResponse, updateUserSchema>, res: Response<MessageResponse>, next: NextFunction) => {

    if (!req.user){
        return res.status(401).json({
            message: "Invalid Action"
        })
    }

    const userObj = req.user;
    await userService.updateUser(req.body, userObj.id);
    return res.json({
        message: 'user details updated successfully'
    })
}