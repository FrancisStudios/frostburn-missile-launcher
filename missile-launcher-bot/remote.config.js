const _TARGET_IP = '172.20.0.20';
const _TARGET_PORT = '80';
const _COMMMANDS_ENDPOINT = '/command'

const SERVER_CONFIG = {
    TARGET_IP : _TARGET_IP,
    TARGET_PORT: _TARGET_PORT,
    ENDPOINTS: {
        COMMAND: _COMMMANDS_ENDPOINT
    },
    EXTERNAL: {
        JOKE_API: 'https://v2.jokeapi.dev/joke/Any?type=single'
    }
}

export default SERVER_CONFIG;