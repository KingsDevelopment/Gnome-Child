import { UserEntity } from './user.entity';
import { getMongoRepository } from 'typeorm';
import { BaseController } from '../../libs/baseController';
import { KlasaUser } from 'klasa';

export class UserController extends BaseController {
	protected _repository = getMongoRepository(UserEntity);

	async checkExistence(klasaUser: KlasaUser) {
		let user = await this._repository.findOne({ id: klasaUser.id.toString() });

		if (!user) {
			user = new UserEntity();
			user.id = klasaUser.id.toString();
		}

		user = {
			...user,
			username: klasaUser.username,
			discriminator: parseInt(klasaUser.discriminator)
		};

		this._repository.save(user);
	}
}
