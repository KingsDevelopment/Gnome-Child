import { KlasaUser, ExtendableStore } from "klasa";
import { UserController } from "../models";

const { Extendable } = require('klasa');

export default class UserModel extends Extendable {

	constructor(store: ExtendableStore, file: string, directory: string) {
		super(store, file, directory, {
			appliesTo: [KlasaUser],
			name: 'UserModel',
			enabled: true
		});
	}

	get model(): Promise<any> {
		if (!this || !this.id) {
			return Promise.resolve(null);
		}

		return this.client.models.user.findByUserId(this.id);
	}

};