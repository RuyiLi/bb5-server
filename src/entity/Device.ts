import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Unit } from './Unit';
import { Sensor } from './Sensor';

export enum DeviceType {
    LIGHTING    = 0,
    VENTILATION = 1,
    WINDOW      = 2,
    SECURITY    = 3,
}


export enum StateType {
    ANALOG  = 0,
    DIGITAL = 1,
}


@Entity()
export class Device {
    
    /**
     * Unique identifier for each device.
     */
    @PrimaryGeneratedColumn('uuid')
    id!: string;


    /**
     * Different types of devices are identified since
     * they need to be handled uniquely. See DeviceType
     * enum for the types of devices currently supported.
     */
    @Column({
        type: 'enum',
        enum: DeviceType
    })
    deviceType!: DeviceType;


    /**
     * The name of the device in a human-readable format 
     * for use in the app. Does not need to be unique, and 
     * will thus not be used to identify anything. Similar to 
     * a user's username.
     */
    @Column({ length: 40 })
    deviceName!: string;


    @UpdateDateColumn()
    lastUpdated!: Date;


    @CreateDateColumn()
    createdAt!: Date;


    /**
     * The measurement system for the state of device.
     * 0 for analog and 1 for digital.
     */
    @Column({
        type: 'enum',
        enum: StateType,
    })
    stateType!: StateType;


    /**
     * If the type is analog, the value is a range from -100 to 100 
     * with 0 representing an "off" state.
     * If the type is digital, the value is either 0 or 1. 0 represents
     * an "off" state, and 1 an "on" state.
     */
    @Column({
        type: 'smallint',
        default: 0,
    })
    stateValue!: number;


    /**
     * MANY devices HAVE ONE unit. Bidirectional.
     */
    @ManyToOne(type => Unit, unit => unit.devices)
    unit!: Unit;


    /**
     * MANY devices HAVE ONE sensor. Bidirectional.
     */
    @ManyToOne(type => Sensor, sensor => sensor.devices, {
        nullable: true,
    })
    sensor?: Sensor;

}