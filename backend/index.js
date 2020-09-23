const { runInNewContext } = require("vm");

let app = require("express")();
let http = require("http").Server(app);
let io = require("socket.io")(http);

const teams = [];

io.on('connection', (socket) => {
    socket.on('addTeam',(msg) => {
        teams.push(msg);
        socket.broadcast.emit('addTeam', msg);
    });
    socket.emit('updateTeams', teams);
    socket.on('startTimer',(msg) => {
        socket.broadcast.emit('startTimer', msg);
    });
    socket.on('stopTimer',(msg) => {
        socket.broadcast.emit('stopTimer', msg);
        for (let team of teams) {
            if(team.name===msg.name) {
              team.time = msg.time;
              break;
            }
        }
    });
});

http.listen(3000, () => {
    console.log("listening");
});