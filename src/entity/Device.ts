import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Unit } from './Unit';
import { Sensor } from './Sensor';

export enum DeviceType {
    LIGHTING    = 0,
    VENTILATION = 1,
    WINDOW      = 2,
    SECURITY    = 3,
}

@Entity()
export class Device {
    
    /**
     * Unique identifier for each device.
     */
    @PrimaryGeneratedColumn('uuid')
    device_id!: string;


    /**
     * Different types of devices are identified since
     * they need to be handled uniquely. See DeviceType
     * enum for the types of devices currently supported.
     */
    @Column({
        type: 'enum',
        enum: DeviceType
    })
    device_type!: DeviceType;


    /**
     * The name of the device in a human-readable format 
     * for use in the app. Does not need to be unique, and 
     * will thus not be used to identify anything. Similar to 
     * a user's username.
     */
    @Column()
    device_name!: string;


    @UpdateDateColumn()
    last_updated!: Date;


    @CreateDateColumn()
    created_at!: Date;


    /**
     * MANY devices HAVE ONE unit. Bidirectional.
     */
    @ManyToOne(type => Unit, unit => unit.devices)
    unit!: Unit;


    /**
     * MANY devices HAVE ONE sensor. Bidirectional.
     */
    @ManyToOne(type => Sensor, sensor => sensor.devices)
    sensor!: Sensor;

}