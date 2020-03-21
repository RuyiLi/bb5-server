import { PrimaryGeneratedColumn, Column, OneToMany, Entity } from 'typeorm';
import { Unit } from './Unit';

// Plural to avoid conflict with built-in user table in pg

@Entity()
export class Users {

    /**
     * Unique identifier for each user.
     */
    @PrimaryGeneratedColumn('uuid')
    id!: string;


    /**
     * App will call the user by this name. 
     * Doesn't have to be unique, won't be used to find
     * anything related to the user (we have the uuid for that).
     */
    @Column({ length: 40 })
    username!: string;
    

    /**
     * A user HAS MANY units. Bidirectional.
     */
    @OneToMany(type => Unit, unit => unit.user)
    units!: Unit[];

}