import { Column, OneToMany, ManyToOne, PrimaryGeneratedColumn, Entity } from 'typeorm';
import { Users } from './User';
import { Device } from './Device';
import { Sensor } from './Sensor';

@Entity()
export class Unit {

    /**
     * Unique identifier for each unit.
     */
    @PrimaryGeneratedColumn('uuid')
    id!: string;


    /**
     * MANY units HAVE ONE user. Bidirectional.
     */
    @ManyToOne(type => Users, user => user.units)
    user!: Users;
    

    /**
     * A unit HAS MANY devices. Bidirectional.
     */
    @OneToMany(type => Device, device => device.unit)
    devices!: Device[];


    /**
     * A unit HAS MANY sensors. Bidirectional.
     */
    @OneToMany(type => Sensor, sensor => sensor.unit)
    sensors!: Sensor[];

}