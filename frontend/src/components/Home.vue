<template>
  <div v-if="admin" class="add">
    <input placeholder="Team name" v-model="newTeam">
    <button @click="addTeam">Add </button>
  </div>
  <div class="container">
    <div class="teams">
      <div v-for="team in racing" :key="team.name" class="team">
        <img class="team__image" src="../assets/row.png" alt="">
        <div class="item item__name">{{team.name}}</div>
        <div class="item">{{formatNumber(team.time)}}</div>
        <div v-if="admin">
          <button @click="deleteTeam(team)">delete</button>
          <button v-if="!team.active" @click="startTimer(team)">start</button>
          <button v-else @click="stopTimer(team)">stop</button>
          <button v-if="!team.active" @click="finish(team)">finnish</button>
        </div>
      </div>
    </div>
    <div class="filler"></div>
    <div class="finished">
      <div class="team" v-for="team in finished" :key="team.name">
        <img class="team__image" src="../assets/row.png" alt="">
        <div class="item item__name">{{team.name}}</div>
        <div class="item">{{formatNumber(team.time)}}</div>
        <button v-if="admin" @click="deleteTeam(team)">delete</button>
      </div>
    </div>
  </div>
</template>

<script>
import SocketIO from 'socket.io-client';
export default {
  name: 'Main',
  data() {
    return {
      admin: false,
      teams: [],
      newTeam: '',
      io: null,
    }
  },
  methods: {
    addTeam() {
      const newTeam = {
        name: this.newTeam,
        time: 0,
        finished: false
      }
      this.teams.push(newTeam);
      this.io.emit('addTeam', newTeam);
      this.newTeam = '';
    },
    deleteTeam(t, emitted= false) {
      for (let i = 0; i < this.teams.length; i += 1) {
        const team = this.teams[i];
        if(team.name===t.name) {
          if (!emitted) this.io.emit('delete',team);
          this.teams.splice(i,1)
        }
      }
    },
    startTimer(team, emitted = false) {
      if(!team.active) {
        team.active = true
        team.interval = setInterval(() => team.time += 1, 100);
        if (!emitted) this.io.emit('startTimer',team);
      }
    },
    stopTimer(team, emitted=false) {
      if(team.active) {
        clearInterval(team.interval);
        if (!emitted) this.io.emit('stopTimer',team);
        team.active = false;
      }
    },
    finish(team, emitted=false) {
      team.finished = true
      if (!emitted) this.io.emit('finish',team);
    },
    formatNumber(n) {
      let minutes = Math.floor(n/600);
      let seconds = Math.floor(n/10 - minutes*60);
      let tens = n - minutes*600 - seconds*10
      if(minutes < 10) minutes = "0"+minutes;
      if(seconds < 10) seconds = "0"+seconds;
      return `${minutes}:${seconds}:${tens}0`
    },
  },
  mounted() {
    this.admin = window.location.pathname === '/admin'
  },
  computed: {
    finished () {
      return this.teams.filter(team => team.finished).sort((a,b) => a.time-b.time)
    },
    racing() {
      return this.teams.filter(team => !team.finished)
    }
  },
  created() {
    this.io = SocketIO('http://localhost:3000');
    this.io.on('updateTeams',(msg) => {
      this.teams = msg;
    });

    this.io.on('startTimer',(msg) => {
      console.log('startTimer', msg);

      for (let team of this.teams) {
        if(team.name===msg.name && !team.active) {
          this.startTimer(team, true);
          break;
        }
      }
    });

    this.io.on('stopTimer',(msg) => {
      console.log('stopTimer', msg)
      for (let team of this.teams) {
        if(team.name===msg.name && team.active) {
          this.stopTimer(team, true);
          break;
        }
      }
    });

    this.io.on('addTeam',(msg) => {
      for (let team of this.teams) {
        if(team.name===msg.name) {
          return;
        }
      }
      this.teams.push(msg);
    });

    this.io.on('finish',(msg) => {
      for (let team of this.teams) {
        if(team.name===msg.name) {
          this.finish(team, true);
        }
      }
    });
    this.io.on('delete', (msg) => {
      this.deleteTeam(msg, true)
    });
  }
}
</script>

<style>
.team {
  margin-bottom: 0.5rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;
  justify-content: space-around;
  width: 500px;
  height: 50px;
}
.team__image {
  z-index: -1;
  position: absolute;
  top: 0;
  left: 0;
  height: 50px;
  width: 500px;
  background-color: transparent;
}
.teams {
  flex: 1;
  height: 100%;
}
.item {
  flex: 1;
  margin-left: 5rem;
  color: white;
  font-weight: bold;
  font-size: 1rem;
}
.filler {
  flex: 2;
}
.item__name {
  margin-left: 11rem;
}
.finished {
  flex: 1;
  float: left;
  width: 500px;
}
.container {
  display: flex;
  justify-content: space-between;
  width: 100%;
}
html{
  background-color: red;
}

</style>
