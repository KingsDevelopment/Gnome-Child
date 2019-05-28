import { GuildEntity } from './guild.entity';
import { getMongoRepository } from 'typeorm';
import { BaseController } from '../../libs/baseController';

export class GuildController extends BaseController {
	protected _repository = getMongoRepository(GuildEntity);

	async checkExistence(guildId: string) {
		let guild = await this._repository.findOne({ id: guildId });

		if (!guild) {
			guild = new GuildEntity();
			guild.id = guildId;
		}

		this._repository.save(guild);
	}
}