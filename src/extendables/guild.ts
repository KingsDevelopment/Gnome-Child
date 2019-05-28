import { ExtendableStore, KlasaGuild } from "klasa";

const { Extendable } = require('klasa');

export default class extends Extendable {

	constructor(store: ExtendableStore, file: string[], directory: string) {
		super(store, file, directory, {
			appliesTo: [KlasaGuild]
		});
	}

	get model(): Promise<any> {
		if (!this || !this.id) {
			throw new Error("NO_USER");
		}

		return this.client.models.guild.findById(this.id);
	}
};
