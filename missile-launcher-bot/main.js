import { Client, GatewayIntentBits } from 'discord.js';
import { config } from 'dotenv';
import * as TOKENS from './tokens.store.js'

/* UNICUM(TM) MINECRAFT-API ENDPOINT CONFIG*/


/* BOT SETUP */
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

config(); client.login(process.env.FROSTBURN_BOT_TOKEN);

const LAUNCHKEYS = {
    _launchKey1: false, _launchKey1Owner: '',
    _launchKey2: false, _launchKey2Owner: '',
}

let SERVER_LAUNCHED = false;

/* MESSAGE HANDLER */
client.on('messageCreate', (message) => {
    /* SERVER START SCENARIO (SORRY FOR THE SPAGHETTO)*/
    if (message.content === TOKENS.COMMANDS.LAUNCH_VOTE) {
        if (LAUNCHKEYS._launchKey1 + LAUNCHKEYS._launchKey2 !== 2) {
            /* FILLING UP LAUNCHKEYS */
            if (LAUNCHKEYS._launchKey1Owner !== message.author.globalName && LAUNCHKEYS._launchKey2Owner !== message.author.globalName) {
                if (!SERVER_LAUNCHED) {
                    console.log("✅Voted for start: ", message.author.globalName);
                    if (LAUNCHKEYS._launchKey1 === false) {
                        LAUNCHKEYS._launchKey1 = true;
                        LAUNCHKEYS._launchKey1Owner = message.author.globalName;
                        clearVotesCounter(message.channel);
                        message.reply(`${TOKENS.RESPONSES.VOTE_REGISTERED} 1`);
                    } else if (LAUNCHKEYS._launchKey2 === false) {
                        LAUNCHKEYS._launchKey2 = true;
                        LAUNCHKEYS._launchKey2Owner = message.author.globalName;
                        clearVotesCounter(message.channel);
                        message.reply(`${TOKENS.RESPONSES.VOTE_REGISTERED} 2`);
                        launchFrostburn(message);
                    }

                } else { message.channel.send(TOKENS.RESPONSES.SERVER_IS_ALREADY_STARTING); } // ! SERVER LAUNCHED
            } else { message.reply(TOKENS.RESPONSES.YOU_ALREADY_VOTED); } // ! MESSAGE AUTHOR IS NOT OWNER OF ONE OF THE KEYS
        } else { message.channel.send(TOKENS.RESPONSES.SERVER_IS_ALREADY_STARTING); } // ! THERE IS AN OPEN LAUNCH KEY
    }

    /* SERVER STOP SCENARIO */
    if (message.content === TOKENS.COMMANDS.STOP_HALT) {
        if (SERVER_LAUNCHED) {
            message.channel.send(TOKENS.RESPONSES.SERVER_HALTED);
            haltFrostburn();
        } else { message.channel.send(TOKENS.RESPONSES.SERVER_IS_ALREADY_HALTED); }
    }
});

/* SET TIMEOUT FOR DEPLEATING VOTES */
const clearVotesCounter = (channel) => {
    setTimeout(() => {
        LAUNCHKEYS._launchKey1 = false; LAUNCHKEYS._launchKey2 = false;
        LAUNCHKEYS._launchKey1Owner = ''; LAUNCHKEYS._launchKey2Owner = '';
        if (!SERVER_LAUNCHED) channel.send(TOKENS.RESPONSES.VOTES_CLEARED);
    }, 120000);
}
