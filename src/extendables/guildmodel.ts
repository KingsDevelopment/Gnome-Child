import { ExtendableStore, KlasaGuild } from "klasa";

const { Extendable } = require('klasa');

export default class GuildModel extends Extendable {

	constructor(store: ExtendableStore, file: string, directory: string) {
		super(store, file, directory, {
			appliesTo: [KlasaGuild],
			name: 'GuildModel',
			enabled: true
		});
	}

	get model(): Promise<any> {
		if (!this || !this.id) {
			throw new Error("NO_USER");
		}

		return this.client.models.guild.findById(this.id);
	}
};
