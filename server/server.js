const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
    cors: {
        origin: ["http://localhost:3000"]
    }
});
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const cors = require("cors");
const bodyParser = require("body-parser");

const database = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password1',
    database: 'chess',
    port: '3306'
});

database.connect(err => {
    if (err) throw err;
    console.log("Connected!");
});

database.query("SELECT * FROM ??", ["users"], (err, res) => {
    if (err) throw err;
    console.log(res);
});

app.use(cors());

app.use(function (req, res, next) {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    
    next();
});


app.get('/', (req, res) => {
    res.status(200).json({status: true})
});

app.post("/create-account", bodyParser.json(), (req, res) => {
    const data = req.body;
    let sql = "SELECT * FROM ?? WHERE email = ?";
    database.query(sql, ["users", data.email], async (err, rows) => {
        if (err) throw err;
        if (rows.length !== 0) {
            res.json({error: "Username / email already in use!"});
            return;
        }

        const passwordHash = await bcrypt.hash(data.password, 10);
        
        sql = "INSERT INTO ?? (username, email, password, points, friends, socket_id) VALUES (?, ?, ?, ?, ?, ?)";
        database.query(sql, ["users", data.username, data.email, passwordHash, 0, JSON.stringify([]), data.socketId], (err, result) => {
            if (err) throw err;
            sql = "SELECT * FROM ?? WHERE email = ?";
            database.query(sql, ["users", data.email], (err, registeredRows) => {
                if (err) throw err;
                res.json({ status: "success", id: registeredRows[0]["id"] });
            });
        });
    });
});

app.post("/login-user", bodyParser.json(), (req, res) => {
    const data = req.body;
    let sql = "SELECT * FROM ?? WHERE email = ?";
    database.query(sql, ["users", data.email], async (err, rows) => {
        if (err) throw err;
        if (rows.length !== 1) {
            res.json({
                error: "No user found!",
                logged: false
            });
            return;
        }
        const row = rows[0];
        const samePassword = await bcrypt.compare(data.password, row.password);
        if (!samePassword) {
            res.json({
                error: "The email address or password is incorrect!",
                logged: false
            });
            return;
        }

        console.log("User logged");

        res.json({...row, logged: true});
    });
});

app.post("/update-points", bodyParser.json(), (req, res) => {
    const data = req.body;
    const sql = "UPDATE ?? SET points = ? WHERE id = ?";
    database.query(sql, ["users", data.points, data.id], (err, result) => {
        if (err) throw err;
        console.log("Updated points: ", data.points);
        res.json({status: true})
    }); 
});

app.post("/add-friend", bodyParser.json(), (req, res) => {
    const data = req.body;
    let sql = "SELECT * FROM ?? WHERE id = ?";
    database.query(sql, ["users", data.id], (err, rows) => {
        if (err) throw err;
        if (rows.length !== 1) {
            res.status(404).json({error: true});
            return;
        }

        const friends = [...JSON.parse(rows[0]["friends"]), data.friend];
        sql = "UPDATE ?? SET friends = ? WHERE id = ?";
        database.query(sql, ["users", JSON.stringify(friends), data.id], (err, result) => {
            if (err) throw err;
            console.log("Friend added", friends);
            res.status(200).json({status: true});
        });
    });
});

app.post("/remove-friend", bodyParser.json(), (req, res) => {
    const data = req.body;
    let sql = "SELECT * FROM ?? WHERE id = ?";
    database.query(sql, ["users", data.id], (err, rows) => {
        if (err) throw err;
        const friends = [...JSON.parse(rows[0]["friends"])].filter(friend => friend !== data.friend);
        sql = "UPDATE ?? SET friends = ? WHERE id = ?";
        database.query(sql, ["users", JSON.stringify(friends), data.id], (errs, result) => {
            if (errs) throw errs;
            console.log(result);
            res.status(200).json({status: true});
        });
    });
});

app.post("/update-socket", bodyParser.json(), (req, res) => {
    const data = req.body;
    let sql = "UPDATE ?? SET socket_id = ? WHERE id = ?";
    database.query(sql, ["users", data.socketId, data.id], (err, result) => {
        if (err) throw err;
        console.log("Update socket");
    });
});

app.post("/get-user", bodyParser.json(), (req, res) => {
    const id = req.body.id;
    console.log(id);
    let sql = "SELECT * FROM ?? WHERE id = ?";
    database.query(sql, ["users", id], (err, rows) => {
        if (err) throw err;
        if (rows.length !== 1) {
            console.log("NOT FOUND!");
            res.json({error: "Not found!"});
            return;
        }
        console.log(rows[0]);
        res.json(rows[0]);
    });
});

app.post("/get-rank", bodyParser.json(), (req, res) => {
    const id = req.body.id;

    let sql = "SELECT * FROM ?? ORDER BY points DESC";
    
    database.query(sql, ["users"], (err, rows) => {
        if (err) throw err;
        let rank, position = 1;
        rows.forEach(row => {
            if (row["id"] === id) rank = position;
            position++;
        });

        console.log("Your rank is: ", rank);

        res.json({rank: rank});
    });
});

app.post("/upload-image", bodyParser.json(), (req, res) => {
    console.log(req.body);
});

app.post("/delete-account", bodyParser.json(), (req, res) => {
    const data = req.body;
    const sql = "DELETE FROM ?? WHERE id = ?";
    database.query(sql, ["users", data.id], (err, result) => {
        if (err) throw err;
        console.log("Account deleted");
        res.json({status: true});
    });
});

// Socket connection
let players = 0, rooms = {}, player = 0;
io.on('connection', socket => {
    players++;
    console.log("socket connected", players);
    // Emitting message
    
    let globalRoom;
    socket.on("create-room", room => {
        
        let sameRoom = Object.keys(rooms).some(currRoom => currRoom === room);
        console.log('line 35', room, rooms, sameRoom);

        if (!sameRoom) {
            rooms[room] = 1;
           
            io.emit("rooms", rooms);
            
        } else rooms[room]++;

        socket.join(room);
        globalRoom = room;
       
    });
    
    let singleTime = true;

    socket.on("get-players", () => {
        if (!singleTime) return;
        console.log(globalRoom);
        console.log("sockets from this room", [...io.sockets.adapter.rooms.get(globalRoom)]);
        io.emit("check_id", [...io.sockets.adapter.rooms.get(globalRoom)]);
        io.emit("players", [...io.sockets.adapter.rooms.get(globalRoom)].length);
        singleTime = false;
    });

    socket.on("move-piece", (oldIdx, newIdx, pieceCode, sound) => {
        console.log(globalRoom, "this is global room");
        console.log('from move piece', oldIdx, newIdx, pieceCode);
        socket.broadcast.to(globalRoom).emit("send-piece", oldIdx, newIdx, pieceCode, sound);
    });

    socket.on("send-message", (message) => {
        socket.broadcast.to(globalRoom).emit("recieve-message", message);
    });

    socket.on("send-username", (username, playerId) => {
        const opponentId = [...io.sockets.adapter.rooms.get(globalRoom)].find(id => id !== playerId);
        console.log("ID:", opponentId, username, playerId);
        if (opponentId) socket.to(opponentId).emit("username-opponent", username);
    });
    
    // Disconnect
    socket.on('disconnect', () => {
        players--;
        
        console.log('socket disconnect', players);
        
    });
});

const port = 8000 || process.env.PORT;

http.listen(port, () => console.log('Server started on port ' + port));