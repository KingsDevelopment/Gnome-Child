import { Client as KlasaClient } from 'klasa';

export class Client extends KlasaClient {
	public constructor() {
		super({
			prefix: process.env.DEFAULT_PREFIX,
			commandEditing: true,
			typing: true,
			ownerID: process.env.OWNER_ID,
			createPiecesFolders: false,
			providers: {
				default: 'mongodb',
				mongodb: {
					host: process.env.DB_HOST,
					port: process.env.DB_PORT,
					db: process.env.DB_NAME
				}
			},
			readyMessage: (client: any) => `Successfully initialized. Ready to serve ${client.guilds.size} guilds.`
		});

		this.login(process.env.TOKEN);
	}
};
