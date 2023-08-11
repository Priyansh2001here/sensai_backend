import { DataSource } from "typeorm";
import {Invite, User} from '../api/users/user.schema';

const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.POSTGRES_USER;
const DB_PASSWORD = process.env.POSTGRES_PASSWORD;
const DB_NAME = process.env.POSTGRES_DB;

export const AppDataSource = new DataSource({
    type: "postgres",
    host: DB_HOST,
    port: 5432,
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    synchronize: true,
    logging: process.env.NODE_ENV === 'production' ? true : false,
    entities: [User, Invite],
    subscribers: [],
    migrations: [],
})

AppDataSource.initialize()
    .then(() => {
        console.log('Database Connected !!')
        })
    .catch((error) => console.log(error))


export default AppDataSource;