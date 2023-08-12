export class FrostburnLaunchkeys {
    SERVER_LAUNCHED = false;
    KEY1 = {
        launchKey1Set: false,
        launchKey1Owner: ''
    }
    KEY2 = {
        launchKey2Set: false,
        launchKey2Owner: ''
    }

    constructor() { }

    static getInstance() {
        if (!this.instance) {
            this.instance = new FrostburnLaunchkeys();
        }
        return this.instance;
    }


    /**
     * @param {string} ownerName
     */
    set setLaunchKey1(ownerName) {
        this.KEY1.launchKey1Set = true;
        this.KEY1.launchKey1Owner = ownerName;
    }

    get getLaunchKey1() { return this.KEY1; }

    /**
     * @param {string} ownerName
     */
    set setLaunchKey2(ownerName) {
        this.KEY2.launchKey2Set = true;
        this.KEY2.launchKey2Owner = ownerName;
    }

    get getLaunchKey2() { return this.KEY2; }

    get isServerLaunched() { return this.SERVER_LAUNCHED; }

    /**
     * @param {boolean} status
     */
    set setServerOnlineStatus(status) { this.SERVER_LAUNCHED = status; }

    isAlreadyKeyOwner(messageAuthorName) {
        return (
            this.KEY1.launchKey1Owner === messageAuthorName &&
            this.KEY2.launchKey2Owner === messageAuthorName
        );
    }

    isAllKeysSet() {
        return (
            this.KEY1.launchKey1Set + this.KEY2.launchKey2Set == 2 &&
            (this.KEY1.launchKey1Owner !== '' && this.KEY2.launchKey2Owner !== '')
        )
    }

    clearAllKeys() {
        this.KEY1 = {
            launchKey1Set: false,
            launchKey1Owner: ''
        }

        this.KEY2 = {
            launchKey2Set: false,
            launchKey2Owner: ''
        }
    }
}