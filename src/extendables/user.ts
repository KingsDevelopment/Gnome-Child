import { KlasaUser, ExtendableStore } from "klasa";
import { Client } from "../libs/client";

const { Extendable } = require('klasa');

export default class UserModel extends Extendable {

	constructor(store: ExtendableStore, file: string[], directory: string) {
		super(store, file, directory, {
			appliesTo: [KlasaUser]
		});
	}

	get model(): Promise<any> {
		if (!this || !this.id) {
			throw new Error("NO_USER");
		}

		return (this.client as Client).models.user.findById(this.id);
	}
};
