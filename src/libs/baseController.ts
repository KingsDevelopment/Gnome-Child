import { MongoRepository } from "typeorm";
import { ObjectID } from 'mongodb';

export class BaseController {
	protected _repository: MongoRepository<any>;
	public readonly name: string;

	findByMongoId(_id: ObjectID) {
		return this._repository.findOne(_id);
	}

	findById(id: number) {
		return this._repository.findOne({
			where: { id: id }
		});
	}

	deleteEntity(entity: any) {
		return this._repository.delete(entity);
	}
}
