import * as TOKENS from '../tokens.store';
import fetch from 'node-fetch';
import * as FrostburnRemote from '../remote.config';

export class FrostburnPowerSwitch {
    instance /* Singleton Instance*/
    client /* discord.js Client */

    constructor(client) {
        this.client = client
    }

    static getInstance(client) {
        if (!this.instance) {
            this.instance = new FrostburnPowerSwitch(client);
        }

        return this.instance;
    }

    /* START SERVER */
    static launchFrostburn = (message) => {
        message.channel.send(TOKENS.RESPONSES.SERVER_STARTING);
        try {
            fetch(`http://${FrostburnRemote.TARGET_IP}:${FrostburnRemote.TARGET_PORT}${FrostburnRemote.ENDPOINTS.COMMAND}`, {
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
                        if (response.status === 200) {
                            console.log("🚀Launching server...");
                            SERVER_LAUNCHED = true;
                        }
                    });
                }
            ).catch(function (err) {
                console.log('Fetch Error :-S', err);
            });
        } catch (error) {
            console.log('😔 No response API server...')
        }
    }

    /* STOP SERVER */ 
    static haltFrostburn = () => {
        try {
            fetch(`http://${FrostburnRemote.TARGET_IP}:${FrostburnRemote.TARGET_PORT}${FrostburnRemote.ENDPOINTS.COMMAND}`, {
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
                        if (response.status === 200) {
                            console.log("❌Stopping server...");
                            LAUNCHKEYS._launchKey1 = false; LAUNCHKEYS._launchKey2 = false;
                            LAUNCHKEYS._launchKey1Owner = ''; LAUNCHKEYS._launchKey2Owner = '';
                            SERVER_LAUNCHED = false;
                        }
                    });
                }
            ).catch(function (err) {
                console.log('Fetch Error :-S', err);
            });
        } catch (error) {
            console.log('😔 No response API server...')
        }
    }
}