import Peer from "peerjs";

export default class ConnectionController {
    public readonly GAME_PREFIX = "agh-bomb-it-";
    private peer: Peer;
    private connection: Peer.DataConnection = null;

    private subscribersMap = new Map<string, ((payload: any) => void)[]>();

    constructor(userKey: string) {
        this.peer = new Peer(this.GAME_PREFIX + userKey);
        this.peer.on("connection", this.defaultConnect);
    }

    private defaultConnect(conn: Peer.DataConnection) {
        conn.on("open", () => {
           conn.send("Peer not initialized");
           setTimeout(() => {
               conn.close();
           }, 500);
        });
    }

    private clientConnect(conn: Peer.DataConnection) {
        conn.on("open", () => {
           conn.send("Client does not accept connection");
           setTimeout(() => {
               conn.close();
           }, 500);
        });
    }

    private hostConnect(conn: Peer.DataConnection) {
        if(this.connection && this.connection.open) {
            conn.on("open", () => {
               conn.send("Host already connected to another client");
               setTimeout(() => {
                   conn.close();
               }, 500);
            });
            return;
        }
        this.connection = conn;
        conn.on("open", () => {
            conn.on("data", this.onMessage);
        });
        console.log("Connected to: " + conn.peer);
    }

    public startHosting() {
        this.peer.off("connection", this.defaultConnect);
        this.peer.on("connection", this.hostConnect);
    }

    public stopHosting() {
        console.log(this.connection);
        this.peer.off("connection", this.hostConnect);
        this.peer.on("connection", this.defaultConnect);

        if(this.connection && this.connection.open) {
            this.connection.close();
            this.connection = null;
        }
    }

    public connectToHost(host_key: string) {
        this.peer.off("connection", this.defaultConnect);
        this.peer.on("connection", this.clientConnect);
        this.connection = this.peer.connect(this.GAME_PREFIX + host_key);
        return new Promise<void>((resolve, reject) => {
            this.connection.on("open", () => {
                this.connection.on("data", this.onMessage);
                resolve();
            })
        })
    };

    public disconnectFromHost() {
        this.peer.off("connection", this.clientConnect);
        this.peer.on("connection", this.defaultConnect);
        this.connection.close();
    }

    public subscribe(category: string, callback: (payload: any) => void) {
        if(!this.subscribersMap.has(category)) {
            this.subscribersMap[category] = [];
        }
        this.subscribersMap[category].push(callback);
    }

    public unsubscribe(category: string, callback: (payload: any) => void) {
        this.subscribersMap[category] = this.subscribersMap[category].filter(entry => entry != callback);
    }

    private onMessage(data: any) {
        const category = data["type"];
        if(this.subscribersMap.has(category)) {
            const subscribers = this.subscribersMap[category];
            subscribers.forEach(callback => {
                callback(data["payload"]);
            })
        }
    }

    public sendToPeer(category: string, message: any) {
        const data = {
            category: category,
            payload: message
        }
        this.connection.send(data);
    }
}
