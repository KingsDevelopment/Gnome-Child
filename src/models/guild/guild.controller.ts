import { GuildEntity } from './guild.entity';
import { getMongoRepository } from 'typeorm';

export class GuildController {
    private _repository = getMongoRepository(GuildEntity);

    async checkExistence(guildId: string) {
        const guild = await this._repository.findOne({ id: guildId });

        if (!guild) {
            await this._repository.insertOne({
                id: guildId
            });
        }
    }
}