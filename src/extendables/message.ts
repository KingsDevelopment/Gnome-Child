import { ExtendableStore } from "klasa";
import { Message } from 'discord.js';

const { Extendable } = require('klasa');

// overwrite default flag regex
const quotes = ['"', "'", '“”', '‘’'];
const { TextPrompt } = require('klasa');
TextPrompt.flagRegex = new RegExp(`(?:--|—)(\\w[\\w-]+)(?:=(?:${quotes.map(qu => `[${qu}]((?:[^${qu}\\\\]|\\\\.)*)[${qu}]`).join('|')}|([^\\s]+)))?`, 'g');

export default class extends Extendable {

	constructor(store: ExtendableStore, file: string[], directory: string) {
		super(store, file, directory, {
			appliesTo: [Message]
		});
	}

	async ask(content, options) {
		const message = await this.sendMessage(content, options);
		if (this.channel.permissionsFor(this.guild.me).has('ADD_REACTIONS')) return awaitReaction(this, message);
		return awaitMessage(this);
	}

	async awaitReply(question, time = 60000, embed) {
		await (embed ? this.send(question, { embed }) : this.send(question));
		return this.channel.awaitMessages(
			message => message.author.id === this.author.id,
			{ max: 1, time, errors: ['time'] }
		)
		.then(messages => messages.first().content)
		.catch(() => false);
	}

	async unreact(emojiID) {
		const reaction = this.reactions.get(emojiID);
		return reaction ? reaction.users.remove(this.client.user) : null;
	}

	sendAndDelete(content, timeout = 5000, options) {
		return this.sendMessage(content, options).then((msg: Message) => msg.delete({ timeout: timeout }))
	}

};

const awaitReaction = async (msg, message) => {
	await message.react('🇾');
	await message.react('🇳');
	const data = await message.awaitReactions(reaction => reaction.users.has(msg.author.id), { time: 20000, max: 1 });
	if (data.firstKey() === '🇾') return true;
	throw null;
};

const awaitMessage = async (message) => {
	const messages = await message.channel.awaitMessages(mes => mes.author === message.author, { time: 20000, max: 1 });
	if (messages.size === 0) throw null;
	const responseMessage = await messages.first();
	if (responseMessage.content.toLowerCase() === 'yes') return true;
	throw null;
};
