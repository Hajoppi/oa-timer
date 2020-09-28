let app = require("express")();
let http = require("http").Server(app);
let io = require("socket.io")(http);
var serveStatic = require('serve-static');

app.use(serveStatic(__dirname + "/dist"));

const teams = [];

io.on('connection', (socket) => {
    socket.on('addTeam',(msg) => {
        console.log("Team added", msg);
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
    socket.on('finish',(msg) => {
        socket.broadcast.emit('finish', msg);
        for (let team of teams) {
            if(team.name===msg.name) {
              team.finished = msg.finished;
              break;
            }
        }
    });
    socket.on('delete',(msg) => {
        socket.broadcast.emit('delete', msg);
        for (let i = 0; i < teams.length; i += 1) {
            const team = teams[i];
            if(team.name===msg.name) {
                teams.splice(i,1)
            }
        }
    });
});

http.listen(80, () => {
    console.log("listening");
});