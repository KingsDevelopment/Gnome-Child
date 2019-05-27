import { GuildEntity } from './guild.entity';
import { getMongoRepository } from 'typeorm';
import { BaseController } from '../../libs/baseController';

export class GuildController extends BaseController {
	protected _repository = getMongoRepository(GuildEntity);

	async checkExistence(guildId: string) {
		const guild = await this._repository.findOne({ id: guildId });

		if (!guild) {
			await this._repository.insertOne({
				id: guildId
			});
		}
	}
}