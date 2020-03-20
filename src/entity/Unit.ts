import { Column, OneToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';
import { Device } from './Device';
import { Sensor } from './Sensor';

export class Unit {

    /**
     * Unique identifier for each unit.
     */
    @PrimaryGeneratedColumn('uuid')
    unitId!: string;


    /**
     * MANY units HAVE ONE user. Bidirectional.
     */
    @ManyToOne(type => User, user => user.units)
    user!: User;
    

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