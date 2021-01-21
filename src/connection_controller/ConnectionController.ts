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

    private defaultConnect = (conn: Peer.DataConnection) => {
        conn.on("open", () => {
            conn.send("Peer not initialized");
            setTimeout(() => {
                conn.close();
            }, 500);
        });
    };

    private onMessage = (data: any) => {
        const category = data["category"];
        console.log(data);
        console.log("receiving: " + category);

        const subscribers = this.subscribersMap[category];
        if(subscribers) {
            subscribers.forEach(callback => {
                callback(data["payload"]);
            });
        }
    };

    private clientConnect = (conn: Peer.DataConnection) => {
        conn.on("open", () => {
           conn.send("Client does not accept connection");
           setTimeout(() => {
               conn.close();
           }, 500);
        });
    };

    private hostConnect = (conn: Peer.DataConnection) => {
        if(this.connection && this.connection.open) {
            conn.on("open", () => {
                console.log("Host already connected to another client");
               conn.send("Host already connected to another client");
               setTimeout(() => {
                   conn.close();
               }, 500);
            });
            return;
        }
        this.connection = conn;
        conn.on("open", () => {
            console.log("Connected to: " + conn.peer);
            conn.on("data", this.onMessage);
            conn.on("close", () => console.log("connection closed"));
            conn.on("error", (err) => console.log(err))
        });

    };

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
        this.connection = this.peer.connect(this.GAME_PREFIX + host_key, {
            reliable: true
        });
        return new Promise<void>((resolve) => {
            this.connection.on("error", (err) => console.log(err));
            this.connection.on("close", () => console.log("connection closed"));
            this.connection.on("open", () => {
                console.log("Connected to: " + this.connection.peer);
                this.connection.on("data", this.onMessage);
                resolve();
            });
        });


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


    public sendToPeer(category: string, message: any) {
        console.log("sending: " + category);
        console.log(message);
        const data = {
            category: category,
            payload: message
        };
        this.connection.send(data);
    }
}
