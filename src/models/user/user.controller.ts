import { UserEntity } from './user.entity';
import { getMongoRepository } from 'typeorm';

export class UserController {
    private _repository = getMongoRepository(UserEntity);

    async checkExistence(userId: string) {
        const user = await this._repository.findOne({ id: userId });
        
        if (!user) {
            await this._repository.insertOne({
                id: userId
            });
        }
    }
}