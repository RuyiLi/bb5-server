import { PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Unit } from './Unit';

export class User {

    /**
     * Unique identifier for each user.
     */
    @PrimaryGeneratedColumn('uuid')
    userId!: string;


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