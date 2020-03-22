import { PrimaryGeneratedColumn, ManyToOne, OneToMany, Column, Entity } from 'typeorm';
import { Unit } from './Unit';
import { Device } from './Device';

@Entity()
export class Sensor {
    
    /**
     * Unique identified for each sensor.
     */
    @PrimaryGeneratedColumn('uuid')
    id!: string;
    
    
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
     * Indicates whether the sensor has been activated or is idle.
     */
    @Column()
    activated!: boolean;
        
    
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