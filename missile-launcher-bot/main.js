import { Client, GatewayIntentBits } from 'discord.js';
import { config } from 'dotenv';
import * as fs from 'fs';
import fetch from 'node-fetch';

/* UNICUM(TM) MINECRAFT-API ENDPOINT CONFIG*/
const _TARGET_IP = '172.20.0.20';
const _TARGET_PORT = '80';
const _COMMMANDS_ENDPOINT = '/command'

/* CHATBOT TOKENS */
const TOKENS = {
    COMMANDS: {
        LAUNCH_VOTE: "/frostburn vote start",
        STOP_HALT: "/frostburn stop"
    },

    RESPONSES: {
        VOTE_REGISTERED: "🔑 Launch key inserted in position",
        VOTE_ALREADY_IN_USE: "✅ You have already voted!",
        SERVER_STARTING: "🚀 Hurray! Two keys are in! Frostburn is starting! 🚀",
        SERVER_IS_ALREADY_STARTING: "⚠️ Server is already started! No need to vote! ⚠️",
        VOTES_CLEARED: "❌ Votes are cleared. Now two keys are needed to launch the server. ❌",
        YOU_ALREADY_VOTED: "⚠️ You have already voted!",
        SERVER_HALTED: "💤 Stopping server...",
        SERVER_IS_ALREADY_HALTED: "💤💤💤 Server is already halted..."
    }
}

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

/* SERVER LAUNCH AND HALT */
const launchFrostburn = (message) => {
    message.channel.send(TOKENS.RESPONSES.SERVER_STARTING);
    SERVER_LAUNCHED = true;
    try {
        fetch(`http://${_TARGET_IP}:${_TARGET_PORT}${_COMMMANDS_ENDPOINT}`, {
            method: 'POST',
            body: '{ "command": "start" }',
            headers: { 'Content-Type': 'application/json' }
        }).then(
            function (response) {
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' +
                        response.status);
                    return;
                }

                /* RESPONSE OK */ 
                response.json().then(function () {
                    if (response.status === 200) console.log("🚀Launching server...");
                });
            }
        ).catch(function (err) {
            console.log('Fetch Error :-S', err);
        });
    } catch (error) {
        console.log('😔 No response API server...')
    }
}

const haltFrostburn = () => {
    LAUNCHKEYS._launchKey1 = false; LAUNCHKEYS._launchKey2 = false;
    LAUNCHKEYS._launchKey1Owner = ''; LAUNCHKEYS._launchKey2Owner = '';
    SERVER_LAUNCHED = false;
    try {
        fetch(`http://${_TARGET_IP}:${_TARGET_PORT}${_COMMMANDS_ENDPOINT}`, {
            method: 'POST',
            body: '{ "command": "stop" }',
            headers: { 'Content-Type': 'application/json' }
        }).then(
            function (response) {
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' +
                        response.status);
                    return;
                }

                /* RESPONSE OK */ 
                response.json().then(function () {
                    if (response.status === 200) console.log("❌Stopping server...");
                });
            }
        ).catch(function (err) {
            console.log('Fetch Error :-S', err);
        });
    } catch (error) {
        console.log('😔 No response API server...')
    }
}

/* SET TIMEOUT FOR DEPLEATING VOTES */
const clearVotesCounter = (channel) => {
    setTimeout(() => {
        LAUNCHKEYS._launchKey1 = false; LAUNCHKEYS._launchKey2 = false;
        LAUNCHKEYS._launchKey1Owner = ''; LAUNCHKEYS._launchKey2Owner = '';
        if (!SERVER_LAUNCHED) channel.send(TOKENS.RESPONSES.VOTES_CLEARED);
    }, 120000);
}
