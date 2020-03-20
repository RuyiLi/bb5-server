import { Column, OneToOne, JoinColumn } from 'typeorm';
import { Device } from './Device';

export enum StateType {
    ANALOG  = 0,
    DIGITAL = 1,
}

export class State {

    /**
     * ONE device HAS ONE state. 
     * Unidirectional relationship until further notice.
     */
    @OneToOne(type => Device)
    @JoinColumn({
        name: 'device_id'
    })
    device!: Device;


    /**
     * The measurement system for the state of device.
     * 0 for analog and 1 for digital.
     */
    @Column({
        type: 'enum',
        enum: StateType,
    })
    type!: StateType;

    
    /**
     * If the type is analog, the value is a range from 0 to 100 
     * with 0 representing an "off" state. Used for devices with a 
     * variable state other than on/off. For example, a lightbulb's
     * brightness can be adjusted to 100 different levels.
     * If the type is digital, the value is either 0 or 1. 0 represents
     * an "off" state, and 1 an "on" state.
     */
    @Column('smallint')
    value!: number;
}