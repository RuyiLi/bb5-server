import { PrimaryGeneratedColumn, ManyToOne, OneToMany, Column } from 'typeorm';
import { Unit } from './Unit';
import { Device } from './Device';

export class Sensor {

    /**
     * Unique identified for each sensor.
     */
    @PrimaryGeneratedColumn('uuid')
    sensorId!: string;

    
    /**
     * Name of the sensor. Only for human-friendly use in the
     * app; will not be used to uniquely identify sensors. 
     */
    @Column({ length: 40 })
    sensorName!: string;
    

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