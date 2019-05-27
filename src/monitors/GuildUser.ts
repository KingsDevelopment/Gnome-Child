import { Monitor, MonitorStore, KlasaMessage } from "klasa";
import { Client } from "../libs/client";

export default class extends Monitor {
	constructor(store: MonitorStore, file: string[], directory: string) {
		super(store, file, directory, {
			name: 'GuildUserMonitor',
			ignoreOthers: false
		});
	}

	run(message: KlasaMessage) {
		const client = message.client as Client;
		const models = client.models;

		if (message.guild) {
			models.guild.checkExistence(message.guild.id);
		}

		models.user.checkExistence(message.author.id, {
			username: message.author.username,
			discriminator: message.author.discriminator
		});
	}

};
