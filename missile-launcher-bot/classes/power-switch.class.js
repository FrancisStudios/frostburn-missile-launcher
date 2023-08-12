import TOKENS from '../tokens.store.js';
import fetch from 'node-fetch';
import SERVER_CONFIG from '../remote.config.js';
import { FrostburnLaunchkeys } from './keys.class.js';

export class FrostburnPowerSwitch {
    instance; /* Singleton Instance*/
    client; /* discord.js Client */
    launchKeys = FrostburnLaunchkeys.getInstance();;

    constructor(client) {
        this.client = client
    }

    static getInstance(client) {
        if (!this.instance) {
            this.instance = new FrostburnPowerSwitch(client);
        }
        return this.instance;
    }

    static returnInstance(){ return this.instance; }

    /* START SERVER */
    launchFrostburn = (message) => {
        message.channel.send(TOKENS.RESPONSES.SERVER_STARTING);
        try {
            fetch(`http://${SERVER_CONFIG.TARGET_IP}:${SERVER_CONFIG.TARGET_PORT}${SERVER_CONFIG.ENDPOINTS.COMMAND}`, {
                method: 'POST',
                body: '{ "command": "start" }',
                headers: { 'Content-Type': 'application/json' }
            }).then(
                function (response) {
                    if (response.status !== 200) {
                        console.log('Looks like there was a problem. Status Code: ' + response.status);
                        return;
                    }

                    /* RESPONSE OK */
                    response.json().then(function () {
                        if (response.status === 200) {
                            console.log("🚀Launching server...");
                            let launchKeys = FrostburnPowerSwitch.returnInstance().launchKeys;
                            launchKeys.setServerOnlineStatus(true);
                        }
                    });
                }
            ).catch(function (err) {
                console.log('Fetch Error :-S', err);
            });
        } catch (error) {
            console.log('😔 No response from API server...')
        }
    }

    /* STOP SERVER */
    haltFrostburn = () => {
        try {
            fetch(`http://${SERVER_CONFIG.TARGET_IP}:${SERVER_CONFIG.TARGET_PORT}${SERVER_CONFIG.ENDPOINTS.COMMAND}`, {
                method: 'POST',
                body: '{ "command": "stop" }',
                headers: { 'Content-Type': 'application/json' }
            }).then(
                function (response) {
                    if (response.status !== 200) {
                        console.log('Looks like there was a problem. Status Code: ' + response.status);
                        return;
                    }

                    /* RESPONSE OK */
                    response.json().then(function () {
                        if (response.status === 200) {
                            console.log("❌Stopping server...");
                            let launchKeys = FrostburnPowerSwitch.returnInstance().launchKeys;
                            launchKeys.clearAllKeys();
                            launchKeys.setServerOnlineStatus = false;
                        }
                    });
                }
            ).catch(function (err) {
                console.log('Fetch Error :-S', err);
            });
        } catch (error) {
            console.log('😔 No response from API server...')
        }
    }
}