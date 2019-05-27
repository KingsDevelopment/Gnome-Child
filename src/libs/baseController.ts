import { MongoRepository } from "typeorm";

export class BaseController {
	protected _repository: MongoRepository<any>;

	findByMongoId(_id: number, relations: Array<string> = []) {
		return this._repository.findOne({
			where: { _id: _id },
			relations: relations
		});
	}

	findById(id: number, relations: Array<string> = []) {
		return this._repository.findOne({
			where: { id: id },
			relations: relations
		});
	}
}
