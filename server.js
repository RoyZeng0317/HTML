// set the server
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const sqlite3 = require("slite3").verbost();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Create the database
const db = new sqlite3.Database("chat.db");

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS messages (
        id INTGER PRIMARY KEY AUTOINCREMENT,
        user TEXT,
        text TEXT,
        time INTEGER,
        expire INTEGER
        )
    `);
});

app.use(express.static(__dirname)); // let the HTML can access

io.on("connection", (socket) => {
    console.log("user connected");

    socket.on("sendMessage", ({user, text}) => {

        const time = Date.now();
        const expire = time + 10000;  // 10 second

        // save in database
        db.run(
            "INSERT INTO messages (user, text, expire) VALUES (?, ?, ?, ?)",
            [user, text, time, expire]
        );

        const message = { user, text, time };

        io.emit("message", message);

        // buring
        setTimeout(() => {

            db.run("DELETE FROM messages WHERE time = ?", [time]);

            io.emit("deleteMessage", { time });
        }, 10000);  // 10 second
    });
});

server.listen(3000, () => {
    console.log("Server running on port 3000");
});