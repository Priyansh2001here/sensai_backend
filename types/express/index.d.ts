import { User } from '../../src/api/users/user.schema'


declare module 'express-serve-static-core' {
   interface Request {
      user?: User | null
   }
}