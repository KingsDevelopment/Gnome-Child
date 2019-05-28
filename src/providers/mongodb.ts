// Copyright (c) 2017-2019 dirigeants. All rights reserved. MIT license.
const { Provider, util: { mergeDefault, mergeObjects, isObject } } = require('klasa');
const { MongoClient: Mongo } = require('mongodb');

export = class extends Provider {

	constructor(...args: Array<any>) {
		super(...args, { description: 'Allows use of MongoDB functionality throughout Klasa' });
		this.db = null;
	}

	async init() {
		const connection = mergeDefault({
			host: 'localhost',
			port: 27017,
			db: 'klasa',
			options: {}
		}, this.client.options.providers.mongodb);

		// If full connection string is provided, use that, otherwise fall back to individual parameters
		const connectionString = this.client.options.providers.mongodb.connectionString || `mongodb://${connection.host}:${connection.port}/${connection.db}`;

		const mongoClient = await Mongo.connect(
			connectionString,
			mergeObjects(connection.options, { useNewUrlParser: true })
		);

		this.db = mongoClient.db(connection.db);
	}

	/* Table methods */

	get exec() {
		return this.db;
	}

	hasTable(table: any) {
		return this.db.listCollections().toArray()
			.then(
				(collections: any) => collections.some((col: any) => col.name === table)
			);
	}

	createTable(table: any) {
		return this.db.createCollection(table);
	}

	deleteTable(table: any) {
		return this.db.dropCollection(table);
	}

	/* Document methods */

	getAll(table: any, filter: Array<any> = []) {
		if (filter.length) { return this.db.collection(table).find({ id: { $in: filter } }, { _id: 0 }).toArray(); }
		return this.db.collection(table).find({}, { _id: 0 }).toArray();
	}

	getKeys(table: any) {
		return this.db.collection(table).find({}, { id: 1, _id: 0 }).toArray();
	}

	get(table: any, id: any) {
		return this.db.collection(table).findOne(resolveQuery(id));
	}

	has(table: any, id: any) {
		return this.get(table, id).then(Boolean);
	}

	getRandom(table: any) {
		return this.db.collection(table).aggregate({ $sample: { size: 1 } });
	}

	create(table: any, id: any, doc: any = {}) {
		return this.db.collection(table).insertOne(mergeObjects(this.parseUpdateInput(doc), resolveQuery(id)));
	}

	delete(table: any, id: any) {
		return this.db.collection(table).deleteOne(resolveQuery(id));
	}

	update(table: any, id: any, docs: any) {
		return Promise.all(
			docs.map(doc => this.db.collection(table).updateOne(resolveQuery(id), { $set: isObject(doc) ? flatten(doc) : parseEngineInput(doc) }))
		);
	}

	replace(table: any, id: any, doc: any) {
		return this.db.collection(table).replaceOne(resolveQuery(id), this.parseUpdateInput(doc));
	}

};

const resolveQuery = (query: any) => isObject(query) ? query : { id: query };

function flatten(obj: any, path: string = '') {
	let output: any = {};
	output[obj.key] = obj.value;
	return output;
}

function parseEngineInput(updated: Array<any>) {
	return Object.assign({}, ...updated.map(entry => ({ [entry.data[0]]: entry.data[1] })));
}
