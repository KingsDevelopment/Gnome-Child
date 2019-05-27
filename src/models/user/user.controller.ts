import { UserEntity } from './user.entity';
import { getMongoRepository } from 'typeorm';
import { BaseController } from '../../libs/baseController';

export class UserController extends BaseController {
	protected _repository = getMongoRepository(UserEntity);

	async checkExistence(userId: any, data = {}) {
		let user = await this._repository.findOne({ id: userId.toString() });

		if (!user) {
			user = new UserEntity();
			user.id = userId.toString();
		}

		user = {
			...user,
			...data
		};

		this._repository.save(user);
	}
}
