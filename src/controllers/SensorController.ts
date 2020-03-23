import { JsonController, Post, QueryParam, QueryParams, Patch, Get } from 'routing-controllers';
import { getRepository } from 'typeorm';
import { Sensor } from '../entity/Sensor';
import { Device, StateType } from '../entity/Device';
import { Unit } from '../entity/Unit';
import { getWSS, WebSocketMessageType } from '../websocket';

class PostSensorQuery {

    unitId!: string;
    name!: string;
    disabled?: number;

}


/**
 * Changes a sensor's state or toggles it. Returns list of connected
 * devices for convenience.
 * @param sensorId 
 * @param {boolean?} state New state of the sensor. Leave undefined to toggle.
 */
export async function updateSensorState (sensorId: string, state?: boolean): Promise<void> {
    const sensorRepository = getRepository(Sensor);
    const sensor: Sensor | undefined = await sensorRepository
        .createQueryBuilder('sensor')
        .leftJoinAndSelect('sensor.devices', 'devices')
        .where('sensor.id::text = :sensorId', { sensorId })
        .getOne();

    if (typeof sensor === 'undefined') throw new Error('Could not find a sensor with the specified ID.');
    if (sensor.disabled) throw new Error('This sensor has been disabled.');
    
    sensor.activated = typeof state === 'undefined' ? !sensor.activated : state;

    const deviceRepository = getRepository(Device);
    const wss = getWSS();

    for (const device of sensor.devices) {
        if (device.stateType === StateType.ANALOG)
            device.stateValue = Number(sensor.activated) * 100;
        else
            device.stateValue = Number(sensor.activated);

        await deviceRepository.save(device);
        await wss!.broadcastMessage(WebSocketMessageType.DEVICE_STATE_UPDATE, {
            deviceId: device.id,
            stateType: device.stateType,
            stateValue: device.stateValue
        });
    }
}


@JsonController('/sensors')
export class SensorController {

    @Patch('/update')
    async updateSensor (
        @QueryParam('sensor', { required: true }) sensorId: string,
        @QueryParam('activated', { required: false }) activated?: boolean,
    ) {

        try {
            if (typeof activated === 'undefined')
                await updateSensorState(sensorId);
            else
                await updateSensorState(sensorId, activated!);
        } catch (err) {
            return {
                code: 400,
                err
            }
        }

        return {
            code: 200,
        }
    }

    @Post('/create')
    async createSensor (
        @QueryParams() {
            unitId,
            name,
            disabled
        }: PostSensorQuery
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

        const sensor = new Sensor();
        sensor.devices = [];
        sensor.disabled = typeof disabled === 'undefined' || !!disabled;
        sensor.sensorName = name;
        sensor.unit = unit;

        await unitRepository.save(unit);
        await getRepository(Sensor).save(sensor);

        return {
            code: 200,
            sensorId: sensor.id,
        }
    }


    /**
     * Connects a target device with a sensor. Returns the modified sensor.
     * @param {string (uuid)} sensorId 
     * @param {string (uuid)} deviceId 
     */
    @Post('/add_device')
    async addTargetDevice(
        @QueryParam('sensor', { required: true }) sensorId: string,
        @QueryParam('device', { required: true }) deviceId: string,
    ) {
        const sensorRepository = getRepository(Sensor);
        const sensor: Sensor | undefined  = await sensorRepository
            .createQueryBuilder('sensor')
            .leftJoinAndSelect('sensor.devices', 'devices')
            .leftJoinAndSelect('sensor.unit', 'unit')
            .where('sensor.id::text = :sensorId', { sensorId })
            .getOne();

        if (typeof sensor === 'undefined') return {
            code: 404,
            message: 'Could not find a sensor with the specified ID.',
        }

        const deviceRepository = getRepository(Device)
        const device: Device | undefined = await deviceRepository
            .createQueryBuilder('device')
            .leftJoinAndSelect('device.sensor', 'sensor')
            .leftJoinAndSelect('device.unit', 'unit')
            .where('device.id::text = :deviceId', { deviceId })
            .getOne();

        if (typeof device === 'undefined') return {
            code: 404,
            message: 'Could not find a device with the specified ID.',
        }

        if (sensor.unit.id !== device.unit.id) return {
            code: 400,
            message: `Target device (${device.unit.id}) and sensor (${sensor.unit.id}) do not belong to the same unit.`,
        }

        if (sensor.devices.includes(device)) return {
            code: 400,
            message: 'Sensor already targets that device.'
        }

        device.sensor = sensor;
        sensor.devices.push(device);

        await deviceRepository.save(device);
        await sensorRepository.save(sensor);

        return {
            code: 200,
            sensor
        }
    }
    

    @Get('/connected_devices')
    async getConnectedDevices (
        @QueryParam('sensor', { required: true }) sensorId: string,
    ) {
        const sensorRepository = getRepository(Sensor);
        const sensor: Sensor | undefined = await sensorRepository
            .createQueryBuilder('sensor')
            .leftJoinAndSelect('sensor.devices', 'devices')
            .where('sensor.id::text = :sensorId', { sensorId })
            .getOne();

        if (typeof sensor === 'undefined') return {
            code: 404,
            message: 'Could not find a sensor with the specified ID.',
        }

        return {
            code: 200,
            message: sensor.devices,
        }
    }

}