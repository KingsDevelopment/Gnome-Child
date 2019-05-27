import { Client as KlasaClient } from 'klasa';
import { Database } from './database';

import * as fs from 'fs';
import * as path from 'path';

export class Client extends KlasaClient {
	private _db: Database;
	public models: any;

	public constructor() {
		super({
			prefix: process.env.DEFAULT_PREFIX,
			commandEditing: true,
			typing: true,
			owners: process!.env!.OWNERS!.split(','),
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

		this._db = new Database();

		this._init();
	}

	private async _init() {
		await this._db.connect();

		this.models = await this._getModel();

		await this.login(process.env.TOKEN);
	}

	private async _getModel(): Promise<any> {
		const modelsFolder = path.join(process.cwd(), 'dist/models/');
		const files = this._findControllers(modelsFolder);

		const modelControllers: any = {};
		for (const controller of files) {
			const modelName = controller.split('.')[0].split('/').pop();

			const controllerRequire = require(controller);
			const keys = Object.keys(controllerRequire);
			const controllerName = keys[0];

			modelControllers[modelName] = new controllerRequire[controllerName]();
		}

		return modelControllers;
	}

	private _findControllers = (dir: string, filelist?: Array<any>) => {
		const files = fs.readdirSync(dir);
		filelist = filelist || [];

		for (let i: number = 0; i < files.length; i++) {
			const file = files[i];
			if (fs.statSync(dir + file).isDirectory()) {
				filelist = this._findControllers(dir + file + '/', filelist);
			}
			else {
				if(file.indexOf(".controller.") === -1) {
					continue;
				}

				filelist.push(dir + file);
			}
		}
		return filelist;
	};
};
