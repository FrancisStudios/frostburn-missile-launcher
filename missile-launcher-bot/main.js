import { Client, GatewayIntentBits } from 'discord.js';
import { config } from 'dotenv';
import TOKENS from './tokens.store.js';
import { FrostburnLaunchkeys } from './classes/keys.class.js';
import { FrostburnPowerSwitch } from './classes/power-switch.class.js';
import { ErrorHandler } from './classes/error-handler.class.js';
import { FrostburnLogger } from './classes/logger.class.js';

/* Bot Setup */
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

/* Setting Client Configuration */
config(); client.login(process.env.FROSTBURN_BOT_TOKEN);

/* Building Class Instances */
const launchKeys = FrostburnLaunchkeys.getInstance();
const frostburnPS = FrostburnPowerSwitch.getInstance(client);
const errorHandler = ErrorHandler.getInstance(client);
const logger = FrostburnLogger;

/* Program Flow */
client.on('ready', () => {

    logger.logReadyState();

    /* FROSTBURN DISCROD COMMAND HANDLER */
    client.on('messageCreate', (message) => {
        switch (message.content) {
            case TOKENS.COMMANDS.LAUNCH_VOTE:
                if (!launchKeys.isAllKeysSet() && !launchKeys.isAlreadyKeyOwner(message.author.globalName) && !launchKeys.isServerLaunched) {
                    if (!launchKeys.isServerLaunched) {
                        logger.logVotedForStart(message.author.globalName);
                        fillLaunchKeys(message);
                    }
                } else { errorHandler.handleErrorMessages(launchKeys, message); }
                break;

            case TOKENS.COMMANDS.STOP_HALT:
                if (launchKeys.isServerLaunched) {
                    logger.logHaltTrigger(message.author.globalName);
                    message.channel.send(TOKENS.RESPONSES.SERVER_HALTED);
                    frostburnPS.haltFrostburn();
                } else { message.channel.send(TOKENS.RESPONSES.SERVER_IS_ALREADY_HALTED); }
                break;
        }
    });
});

/* Launchkey Setter */
const fillLaunchKeys = (message) => {
    if (!launchKeys.getLaunchKey1.launchKey1Set) {
        launchKeys.setLaunchKey1 = message.author.globalName;
        clearVotesCounter(message.channel);
        message.reply(`${TOKENS.RESPONSES.VOTE_REGISTERED} 1`);
    } else if (!launchKeys.getLaunchKey2.launchKey2Set) {
        launchKeys.setLaunchKey2 = message.author.globalName;
        clearVotesCounter(message.channel);
        message.reply(`${TOKENS.RESPONSES.VOTE_REGISTERED} 2`);
        frostburnPS.launchFrostburn(message);
    }
}

/* Timeout For Votes */
const clearVotesCounter = (channel) => {
    setTimeout(() => {
        launchKeys.clearAllKeys();
        if (!launchKeys.isServerLaunched) channel.send(TOKENS.RESPONSES.VOTES_CLEARED);
    }, 120000);
}
