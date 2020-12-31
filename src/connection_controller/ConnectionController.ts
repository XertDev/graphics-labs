import Peer from "peerjs";

export default class ConnectionController {
    public readonly GAME_PREFIX = "agh-bomb-it-";
    private peer: Peer;

    constructor(userKey: string) {
        this.peer = new Peer(this.GAME_PREFIX + userKey);
    }

    public startHosting() {
        this.peer.on("connection", conn => {
            conn.on("data", data => {
                console.log(data);
                conn.send("Send back")
            })
        })
    }

    public connectToHost(host_key: string) {
        const conn = this.peer.connect(this.GAME_PREFIX + host_key);
        conn.on("open", () => {
            conn.send("Test");
            conn.on("data", data => {
                console.log(data);
            })
        })
    }
}
