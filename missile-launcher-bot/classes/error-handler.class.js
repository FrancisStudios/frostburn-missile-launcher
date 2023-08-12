import TOKENS from '../tokens.store.js';
export class ErrorHandler {
    client /* DC Client */
    instance /* Singleton Instance */

    constructor(client) {
        this.client = client;
    }

    static getInstance(client) {
        if (!this.instance) {
            this.instance = new ErrorHandler(client);
        }
        return this.instance;
    }

    handleErrorMessages(_launchkeys, message) {
        if (_launchkeys.isServerLaunched) message.channel.send(TOKENS.RESPONSES.SERVER_IS_ALREADY_STARTING);
        if (_launchkeys.isAlreadyKeyOwner(message.author.globalName)) message.reply(TOKENS.RESPONSES.YOU_ALREADY_VOTED);
        if (_launchkeys.isServerLaunched) message.channel.send(TOKENS.RESPONSES.SERVER_IS_ALREADY_STARTING);
    }
}