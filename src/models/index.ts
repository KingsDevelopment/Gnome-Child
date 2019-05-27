import { GuildEntity, GuildController } from './guild';
import { UserEntity, UserController } from './user';

export const ENTITIES = [GuildEntity, UserEntity];
export const Controllers = [GuildController, UserController];

export * from './guild';
export * from './user';
