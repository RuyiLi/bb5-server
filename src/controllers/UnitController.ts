import { JsonController, Post, QueryParam, Get } from 'routing-controllers';
import { Unit } from '../entity/Unit';
import { Users } from '../entity/User';
import { getRepository } from 'typeorm';

@JsonController('/units')
export class UnitController {
    
    @Post('/create')
    async createUnit (
        @QueryParam('user', { required: true }) userId: string
    ) {
        const userRepository = getRepository(Users);
        const user: Users | undefined = await userRepository
            .createQueryBuilder('users')
            .where('users.id::text = :userId', { userId })
            .getOne();

        if (typeof user === 'undefined') return {
            code: 404,
            message: 'Could not find a user with the specified ID.'
        }

        const unit = new Unit();
        unit.devices = [];
        unit.sensors = [];
        unit.user = user;

        await userRepository.save(user);
        await getRepository(Unit).save(unit);

        return {
            code: 200,
            unitId: unit.id,
        }
    }

    @Get('/connected_devices')
    async getDevices (
        @QueryParam('unit', { required: true }) unitId: string
    ) {
        const unit: Unit | undefined = await getRepository(Unit)
            .createQueryBuilder('unit')
            .leftJoinAndSelect('unit.devices', 'device')
            .where('unit.id::text = :unitId', { unitId })
            .getOne();

        if (typeof unit === 'undefined') return {
            code: 404,
            message: 'Could not find a unit with the specified ID.',
        }

        return {
            code: 200,
            devices: unit.devices || [],
        }
    }

}