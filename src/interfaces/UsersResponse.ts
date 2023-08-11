import { User } from "../api/users/user.schema";
import {z} from 'zod';

export interface UserList {
    users: User[]
}

export const UserLogin = z.object({
    email: z.string().email().nonempty(),
    password: z.string().nonempty()
})

export interface UserLoginResponse {
    token: string,
    email: string,
    fullName: string,
    isAdmin: boolean,
    id: string
}

export type UserLogin = z.infer<typeof UserLogin>;