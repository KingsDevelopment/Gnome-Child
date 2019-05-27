import { UserEntity } from './user.entity';
import { getMongoRepository } from 'typeorm';

export class UserController {
	private _repository = getMongoRepository(UserEntity);

	async checkExistence(userId: number) {
		const user = await this._repository.findOne({ id: userId });

		if (!user) {
			await this._repository.insertOne({
				id: userId
			});
		}
	}

	findByUserId(userId: number) {
		return this._repository.findOne({ id: userId });
	}
}