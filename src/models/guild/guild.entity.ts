import {Entity, Column, ObjectIdColumn, ObjectID, CreateDateColumn, UpdateDateColumn} from "typeorm";

@Entity({
	name: 'guilds'
})
export class GuildEntity {

	@ObjectIdColumn()
	_id: ObjectID;

	@Column()
	id: String;

	@Column()
	prefix: String;

	@Column()
	language: String;

	@Column()
	disableNaturalPrefix: Boolean;

	@Column()
	disabledCommands: Array<any>;

	@CreateDateColumn()
	created: Date;

	@UpdateDateColumn()
	modified: Date;
}