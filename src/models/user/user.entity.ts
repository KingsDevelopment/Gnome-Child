import {Entity, Column, ObjectIdColumn, ObjectID, CreateDateColumn, UpdateDateColumn} from "typeorm";

@Entity({
	name: 'users'
})
export class UserEntity {

	@ObjectIdColumn()
	_id: ObjectID;

	@Column()
	id: string;

	@Column()
	username: string;

	@Column()
	discriminator: number;

	@CreateDateColumn()
	created: Date;

	@UpdateDateColumn()
	modified: Date;
}