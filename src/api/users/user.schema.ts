import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToMany, ManyToOne } from "typeorm"

import z from 'zod';

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number

    @Column({
        length: 100
    })
    fullName: string

    @Column({
        length: 100,
        unique: true
    })
    email: string

    @Column()
    password: string

    @Column({default: false})
    isAdmin: boolean

    @ManyToOne(() => User)
    @JoinColumn()
    invitedBy: User

    @OneToMany(() => Invite, (invite) => invite.createdBy, { cascade: ['remove'] })
    invites: Invite[]

};

@Entity()
export class Invite {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => User,(u)=> u.invites)
    createdBy: User

    @Column({
        default: false,
    })
    isUsed: boolean
    
};


export const baseInsertUserSchema = z.object({
    fullName: z.string(),
    email: z.string().email(),
    password: z.string(),
    isAdmin: z.boolean().default(false),
});


export const insertUserSchemaWithInviteCode = z.intersection(baseInsertUserSchema, z.object({
    invitedCode: z.string().uuid()
}));


export type insertUserSchemaWithInviteCode = z.infer<typeof insertUserSchemaWithInviteCode>;
export type baseInsertUserSchema = z.infer<typeof baseInsertUserSchema>

export interface selectUserSchema extends baseInsertUserSchema{
    id: number,
    invitedBy: selectUserSchema
}

export interface insertUserSchema extends baseInsertUserSchema {
    invitedBy: selectUserSchema

}

export interface insertInviteSchema {
    createdBy: User
}