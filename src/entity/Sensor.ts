import { PrimaryGeneratedColumn, ManyToOne, OneToMany, Column } from 'typeorm';
import { Unit } from './Unit';
import { Device } from './Device';

export class Sensor {

    /**
     * Unique identified for each sensor.
     */
    @PrimaryGeneratedColumn('uuid')
    sensor_id!: string;


    /**
     * Whether or not to listen for changes from this sensor.
     */
    @Column()
    disabled!: boolean;


    /**
     * MANY devices HAVE ONE unit. Bidirectional.
     */
    @ManyToOne(type => Unit, unit => unit.sensors)
    unit!: Unit;


    /**
     * A sensor HAS MANY devices. Bidirectional.
     */
    @OneToMany(type => Device, device => device.sensor)
    devices!: Device[];

}