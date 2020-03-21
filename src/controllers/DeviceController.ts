import { JsonController, Get, QueryParam, Post, QueryParams, Patch, State } from 'routing-controllers';
import { getRepository } from 'typeorm';
import { Unit } from '../entity/Unit';
import { DeviceType, Device, StateType } from '../entity/Device';
import { IsEnum } from 'class-validator';

class PostDeviceQuery {
    
    deviceName!: string;
    unitId!: string;

    @IsEnum(DeviceType)
    deviceType!: DeviceType;

    @IsEnum(StateType)
    stateType!: StateType;

}

class PatchDeviceQuery {

    deviceId!: string;
    deviceName?: string;
    stateValue?: number;

    @IsEnum(DeviceType)
    deviceType?: DeviceType;

    @IsEnum(StateType)
    stateType?: StateType;

}

@JsonController('/devices')
export class DeviceController {

    /**
     * Returns the state of a specified device.
     * @param {string (uuid)} deviceId The ID of the device.
     */
    @Get('/state')
    async getDeviceState (
        @QueryParam('device', { required: true }) deviceId: string
    ) {
        const device: Device | undefined = await getRepository(Device)
            .createQueryBuilder('device')
            .where('device.id::text = :deviceId', { deviceId })
            .getOne();

        if (typeof device === 'undefined') return {
            code: 404,
            message: 'Could not find a device with the specified ID.',
        }

        return {
            code: 200,
            state: {
                type: device.stateType,
                value: device.stateValue,
            },
        }
    }


    /**
     * Updates information regarding the specified device.
     * @param {string (uuid)} deviceId The ID of the device to update.
     * @param {string?} deviceName The updated name of the device.
     * @param {DeviceType?} deviceType The updated type of the device.
     * @param {number?} stateValue The value of the state of the device.
     * @param {StateType?} stateType The updated type of the state of the device.
     */
    @Patch('/')
    async updateDevice (
        @QueryParams() { 
            deviceId,
            deviceName,
            deviceType,
            stateValue,
            stateType 
        }: PatchDeviceQuery
    ) {
        const deviceRepository = getRepository(Device);
        const device: Device | undefined = await deviceRepository
            .createQueryBuilder('device')
            .where('device.id::text = :deviceId', { deviceId })
            .getOne();

        if (typeof device === 'undefined') return {
            code: 404,
            message: 'Could not find a device with the specified ID.'
        }

        if (typeof deviceName !== 'undefined') device.deviceName = deviceName;
        if (typeof deviceType !== 'undefined') device.deviceType = deviceType;
        if (typeof stateType !== 'undefined') device.stateType = stateType;
        if (typeof stateValue !== 'undefined') {
            if (stateValue < -100 || stateValue > 100) return {
                code: 400,
                message: 'stateValue must be between -100 and 100, inclusive.'
            }
            device.stateValue = stateValue;
        }

        await deviceRepository.save(device);

        return { 
            code: 200,
            device,
        };
    }


    /**
     * Creates and links a device with the specified unit.
     * @param {string} deviceName The name of the new device. 
     * @param {string (uuid)} unitId The ID of the unit that this device belongs to. 
     * @param {DeviceType} deviceType The type of the new device. 
     * @param {StateType} stateType The type of the state of the new device.
     */
    @Post('/create')
    async createDevice (
        @QueryParams() { 
            deviceName, 
            unitId, 
            deviceType, 
            stateType 
        }: PostDeviceQuery
    ) {
        const unitRepository = getRepository(Unit);
        const unit: Unit | undefined = await unitRepository
            .createQueryBuilder('unit')
            .where('unit.id::text = :unitId', { unitId })
            .getOne();

        if (typeof unit === 'undefined') return {
            code: 404,
            message: 'Could not find a unit with the specified ID.',
        }

        const device = new Device();
        device.deviceName = deviceName;
        device.deviceType = deviceType;
        device.stateType = stateType;
        device.unit = unit;

        await unitRepository.save(unit);
        await getRepository(Device).save(device);

        return {
            code: 200,
            deviceId: device.id,
        }
    }

}