import { Client, GatewayIntentBits } from 'discord.js';
import { config } from 'dotenv';
import * as TOKENS from './tokens.store.js'
import { FrostburnLaunchkeys } from './classes/keys.class.js';
import { FrostburnPowerSwitch } from './classes/power-switch.class.js';

/* BOT SETUP */
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

config(); client.login(process.env.FROSTBURN_BOT_TOKEN);

const launchKeys = new FrostburnLaunchkeys();
const frostburnPS = new FrostburnPowerSwitch(client);

/* MESSAGE HANDLER */
client.on('messageCreate', (message) => {
    /* SERVER START SCENARIO (SORRY FOR THE SPAGHETTO)*/
    if (message.content === TOKENS.COMMANDS.LAUNCH_VOTE) {
        if (launchKeys.isAllKeysSet && !launchKeys.isAlreadyKeyOwner(message.author.globalName)) {
            if (!launchKeys.isServerLaunched) {
                console.log("✅Voted for start: ", message.author.globalName);
                if (!launchKeys.getLaunchKey1.launchKey1Set) {
                    launchKeys.setLaunchKey1(message.author.globalName);
                    clearVotesCounter(message.channel);
                    message.reply(`${TOKENS.RESPONSES.VOTE_REGISTERED} 1`);
                } else if (!launchKeys.getLaunchKey2.launchKey2Set) {
                    launchKeys.setLaunchKey2(message.author.globalName);
                    clearVotesCounter(message.channel);
                    message.reply(`${TOKENS.RESPONSES.VOTE_REGISTERED} 2`);
                    frostburnPS.launchFrostburn(message);
                }

            }
        } else {
            //TODO: create an error handler where posts the error messages to the author messages
            // else branches were deleted - mind you
        }
    }

    /* SERVER STOP SCENARIO */
    if (message.content === TOKENS.COMMANDS.STOP_HALT) {
        if (launchKeys.isServerLaunched) {
            message.channel.send(TOKENS.RESPONSES.SERVER_HALTED);
            frostburnPS.haltFrostburn();
        } else { message.channel.send(TOKENS.RESPONSES.SERVER_IS_ALREADY_HALTED); }
    }
});

/* SET TIMEOUT FOR DEPLEATING VOTES */
const clearVotesCounter = (channel) => {
    setTimeout(() => {
        launchKeys.clearAllKeys();
        if (!launchKeys.isServerLaunched) channel.send(TOKENS.RESPONSES.VOTES_CLEARED);
    }, 120000);
}
