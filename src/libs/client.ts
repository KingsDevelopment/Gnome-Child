import { Client as KlasaClient, KlasaMessage } from 'klasa';
import { Database } from './database';

import * as fs from 'fs';
import * as path from 'path';

import { Controllers } from '../models';

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

		this._init();
	}

	private async _init() {
		this._db = new Database();
		await this._db.connect();

		this.models = await this._getModel();

		this._extendSettings();
		this._extendPermissions();
		this._listeners();

		await this.login(process.env.TOKEN);
	}

	private async _getModel(): Promise<any> {
		const keys: Array<string> = Object.keys(Controllers);

		const controllers: any = {};
		for (let key of keys) {
			const controller = new Controllers[key]();
			controllers[controller.name] = controller;
		}

		return controllers;
	}

	private _listeners() {
	}

	private _extendSettings() {
		Client.defaultGuildSchema
			.add('botModerator', 'Role', { default: null })
	}

	private _extendPermissions() {
		this.permissionLevels
			.add(5,
				({ member, guild }: KlasaMessage) =>
					guild.settings.get('botModerator') && member.roles.has(guild.settings.get('botModerator').toString()),
				{ fetch: true }
			);
	}
};
