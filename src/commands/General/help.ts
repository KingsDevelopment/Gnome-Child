// Copyright (c) 2017-2019 dirigeants. All rights reserved. MIT license.
import { Command, RichDisplay, util, CommandStore, CommandOptions, KlasaMessage, KlasaUser } from 'klasa';
import { MessageEmbed, Permissions, TextChannel, } from 'discord.js';

const PERMISSIONS_RICHDISPLAY = new Permissions([Permissions.FLAGS.MANAGE_MESSAGES, Permissions.FLAGS.ADD_REACTIONS]);
const time = 1000 * 60 * 3;

export default class extends Command {
	private handlers = new Map();

	public constructor(store: CommandStore, file: string[], directory: string) {

		super(store, file, directory, {
			aliases: ['commands', 'cmd', 'cmds'],
			guarded: true,
			description: (language) => language.get('COMMAND_HELP_DESCRIPTION'),
			usage: '(Command:command)'
		});

		this.createCustomResolver('command', (arg, possible, message) => {
			if (!arg || arg === '') return undefined;
			return this.client.arguments.get('command').run(arg, possible, message);
		});
	}

	public async run(message: KlasaMessage, [command]: [any]): Promise<any> {
		if (command) {
			return message.sendMessage([
				`= ${command.name} = `,
				util.isFunction(command.description) ? command.description(message.language) : command.description,
				message.language.get('COMMAND_HELP_USAGE', command.usage.fullUsage(message)),
				message.language.get('COMMAND_HELP_EXTENDED'),
				util.isFunction(command.extendedHelp) ? command.extendedHelp(message.language) : command.extendedHelp
			], { code: 'asciidoc' });
		}

		if (!('all' in message.flags) && message.guild && (message.channel as TextChannel).permissionsFor(this.client.user).has(PERMISSIONS_RICHDISPLAY)) {
			// Finish the previous handler
			const previousHandler = this.handlers.get(message!.author!.id);
			if (previousHandler) previousHandler.stop();

			const loading: KlasaMessage = await message.send('Loading Commands...') as KlasaMessage;
			const handler = await (await this.buildDisplay(message)).run(loading, {
				filter: (reaction, user: KlasaUser) => user.id === message!.author!.id,
				time
			});
			loading.edit("Here are the available commands:")

			handler.on('end', () => this.handlers.delete(message!.author!.id));
			this.handlers.set(message!.author!.id, handler);
			return handler;
		}

		return message!.author!.send(await this.buildHelp(message), { split: { char: '\n' } })
			.then(() => { if (message.channel.type !== 'dm') message.sendMessage(message.language.get('COMMAND_HELP_DM')); })
			.catch(() => { if (message.channel.type !== 'dm') message.sendMessage(message.language.get('COMMAND_HELP_NODM')); });
	}

	async buildHelp(message: any) {
		const commands = await this._fetchCommands(message);
		const prefix = message.guildSettings.get('prefix');

		const helpMessage = [];
		for (const [category, list] of commands) {
			helpMessage.push(`**${category} Commands**:\n`, list.map(this.formatCommand.bind(this, message, prefix, false)).join('\n'), '');
		}

		return helpMessage.join('\n');
	}

	async buildDisplay(message: KlasaMessage) {
		const commands = await this._fetchCommands(message);
		const prefix = message.guildSettings.get('prefix');
		const display = new RichDisplay();
		const color = message!.member!.displayColor;
		for (const [category, list] of commands) {
			display.addPage(new MessageEmbed()
				.setTitle(`${category} Commands`)
				.setColor(color)
				.setDescription(list.map(this.formatCommand.bind(this, message, prefix, true)).join('\n'))
			);
		}

		return display;
	}

	formatCommand(message: KlasaMessage, prefix: string, richDisplay: boolean, command: any) {
		const description = util.isFunction(command.description) ? command.description(message.language) : command.description;
		return richDisplay ? `• ${prefix}${command.name} → ${description}` : `• **${prefix}${command.name}** → ${description}`;
	}

	async _fetchCommands(message: KlasaMessage) {
		const run = this.client.inhibitors.run.bind(this.client.inhibitors, message);
		const commands = new Map();
		await Promise.all(this.client.commands.map((command) => run(command, true)
			.then(() => {
				const category = commands.get(command.category);
				if (category) category.push(command);
				else commands.set(command.category, [command]);
			}).catch(() => {
				// noop
			})
		));

		return commands;
	}

}