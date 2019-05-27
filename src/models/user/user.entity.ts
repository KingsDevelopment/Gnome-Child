import {Entity, Column, ObjectIdColumn, ObjectID} from "typeorm";

@Entity({
	name: 'users'
})
export class UserEntity {

	@ObjectIdColumn()
	_id: ObjectID;

	@Column()
	id: string;

	@Column({ type: "timestamp", default: () => 'CURRENT_TIMESTAMP' })
	created: string;

}