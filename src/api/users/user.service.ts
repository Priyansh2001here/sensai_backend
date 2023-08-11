import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import { promisify } from 'util';
import  AppDataSource from '../../db';
import { Invite, User, baseInsertUserSchema, insertInviteSchema, insertUserSchema } from './user.schema';
import crypto, { UUID } from 'crypto'
import {SECRET_KEY} from '../../../'
import { UserLoginResponse } from '../../interfaces/UsersResponse';
import { JWTSign } from '../../interfaces/JwtSign';
const userRepository = AppDataSource.getRepository(User);
const inviteRepository = AppDataSource.getRepository(Invite);


export const findById = async (id: number) => {
    
    return await userRepository.findOneBy({
        id: id
    });

}

export const isAdmin = async (id: number) => {
    return (await findById(id))?.isAdmin;
}

export const deleteById = async (id: number) => {

    const result = await userRepository
    .createQueryBuilder()
    .delete()
    .from(User)
    .where("id = :id", {id: id})
    .andWhere("isAdmin = false")
    .execute()

    if (result.affected && result.affected > 0) {
        return true; // User was deleted
    }
    return false; // No user was deleted

}

const findByEmail = async (email: string): Promise<User|null> => {
    return await userRepository.findOneBy({
        email: email
    })
}

const expireInvite = async (inviteObj: Invite) => {
    
    inviteObj.isUsed = true;
    await inviteRepository.save(inviteObj);
    return true;

}

export const addUser = async (user: baseInsertUserSchema, inviteObj: Invite) => {
    const obj = await findByEmail(user.email);
    const invitedBy = inviteObj.createdBy

    if (obj !== null){
        return false;
    }
    
    user.password = await makePassword(user.password);

    const newUser: insertUserSchema = {
        ...user,
        invitedBy: invitedBy
    }

    await userRepository.save(newUser)

    await expireInvite(inviteObj)

    return true;
}

export const getAllUsers = async () => {
    return await userRepository.find();
}


const makePassword = async (password: string, salt?: string) => {

    const hasher = async (password: string, salt? : string) => {
        
        const generateSalt = async (length = 16) => crypto.randomBytes(length).toString('base64');

        // PBKDF2
        const encode = async (password: string, salt: string) => {
            const pbkdf2 = promisify(crypto.pbkdf2);
            return `${salt}$${(await pbkdf2(password, salt, 390000, 64, 'sha256')).toString('base64')}`;
        }

        return await encode(password, salt || await generateSalt());
    }

    return await hasher(password, salt);
}

const decodePassword = async (encodedPassword: string) => encodedPassword.split("$");

const constTimeCompare = async (pass1: string, pass2: string) => {
    
    if (pass2.length !== pass1.length) {
        return false;
    }

    const bufferA = Buffer.from(pass1);
    const bufferB = Buffer.from(pass2);

    return crypto.timingSafeEqual(bufferA, bufferB);

};


const verifyCredentials = async (email: string, password: string): Promise<User|null> => {
    
    const user = await findByEmail(email);

    if (user === null) {
        return null;
    }

    const encodedUserPassword = user.password;
    const [salt, _] = await decodePassword(encodedUserPassword);

    const encoded = await makePassword(password, salt);

    const passMatched =  await constTimeCompare(encoded, encodedUserPassword);

    if (!passMatched){
        return null;
    }

    return user;
}

export const login = async (email: string, password: string): Promise<UserLoginResponse|null> => {
    
    const userIns = await verifyCredentials(email, password);

    if (userIns === null) {
        return null;
    }
    
    const jwtPayload: JWTSign = {
        id: userIns.id.toString(), 
        isAdmin: userIns.isAdmin 
    }

    const token = jwt.sign(jwtPayload, SECRET_KEY);   
    
    return {
        token: token,
        email: userIns.email,
        fullName: userIns.fullName,
        isAdmin: userIns.isAdmin,
        id: userIns.id.toString()
    }

}

export const findInviteByuid = async (uid: string, active=true): Promise<Invite|null> => {
    return await inviteRepository.findOne({where:{id: uid, isUsed: false}, relations: {
        createdBy: true
    }});
}

export const genNewInviteCode = async (userObj: User): Promise<string> => {

    const newInvite: insertInviteSchema = {
        createdBy: userObj
    }

    const res: Invite = await inviteRepository.save(newInvite);
    const primaryKey = res.id;

    return primaryKey;
}