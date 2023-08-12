export class ErrorHandler{
    client /* DC Client */
    instance /* Singleton Instance */ 

    constructor(client){
        this.client = client;
    }
    
    static getInstance(client) {
        if (!this.instance) {
            this.instance = new ErrorHandler(client);
        }
        return this.instance;
    }
}