import {Entity, Column, ObjectIdColumn, ObjectID} from "typeorm";

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

	@Column({ type: "timestamp", default: () => 'CURRENT_TIMESTAMP' })
	created: string;

}