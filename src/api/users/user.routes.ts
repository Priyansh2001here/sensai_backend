import {insertUserSchemaWithInviteCode, updateUserSchema} from './user.schema';
import {Router} from 'express';
import * as handlers from './user.handlers';
import { validationHandler } from '../../middlewares';
import { UserLogin } from '../../interfaces/UsersResponse';

const router = Router()

router.post('/register', validationHandler({body: insertUserSchemaWithInviteCode}) ,handlers.registerUserHandler);

router.get('/list' ,handlers.userListHandler);

router.post('/delete/:id', handlers.deleteUserHandler);

router.post('/login', validationHandler({
    body: UserLogin
}), handlers.loginUserHandler);

router.get('/details', handlers.userDetailsHandler)

router.post('/invite', handlers.newInviteCodeHandler)

router.put('/edit', validationHandler({
    body: updateUserSchema
}), handlers.updateUserHandler)

export default router;  