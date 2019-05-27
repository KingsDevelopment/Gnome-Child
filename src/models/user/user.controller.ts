import { UserEntity } from './user.entity';
import { getMongoRepository } from 'typeorm';
import { BaseController } from '../../libs/baseController';

export class UserController extends BaseController {
	protected _repository = getMongoRepository(UserEntity);

	async checkExistence(userId: number, data = {}) {
		let user = await this._repository.findOne({ id: userId });

		if (!user) {
			user = new UserEntity();
			user.id = userId;
		}

		user = {
			...user,
			...data
		};

		this._repository.save(user);
	}
}
