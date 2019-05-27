import { getConnectionManager, ConnectionManager, Connection } from "typeorm";
import { ENTITIES } from '../models';

export class Database {
	private _manager: ConnectionManager;
	private _connection: Connection;

	private _options: any = {
		type: process.env.DB_TYPE,
		host: process.env.DB_HOST,
		port: process.env.DB_PORT,
		database: process.env.DB_NAME,
		useNewUrlParser: true,
		entities: ENTITIES
	};

	constructor() {
		this._manager = getConnectionManager();
	}

	async connect() {
		this._connection = this._manager.create(this._options);
		return this._connection.connect();
	}
};
