import { JsonController, Post, QueryParam, Get } from 'routing-controllers';
import { Users } from '../entity/User';
import { getRepository } from 'typeorm';

@JsonController('/users')
export class UserController {

    @Post('/create')
    async createUser (
        @QueryParam('username', { required: true }) username: string
    ) {
        const user = new Users();
        user.username = username;
        user.units = [];

        await getRepository(Users).save(user);

        return {
            code: 200,
            userId: user.id,
        }
    }

    @Get('/connected_units')
    async getUnits (
        @QueryParam('user', { required: true }) userId: string
    ) {
        const user: Users | undefined = await getRepository(Users)
            .createQueryBuilder('users')
            .leftJoinAndSelect('users.units', 'unit')
            .where('users.id::text = :userId', { userId })
            .getOne();

        if (typeof user === 'undefined') return {
            code: 404,
            message: 'Could not find a user with the specified ID.',
        }

        return {
            code: 200,
            units: user.units || []
        }
    }

}