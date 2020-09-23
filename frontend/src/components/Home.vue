<template>
  <div class="add">
    <input placeholder="Team name" v-model="newTeam">
    <button @click="addTeam">Add </button>
  </div>
  <div class="teams">
    <div v-for="team in teams" :key="team.name" class="team">
      <div class="item">{{team.name}}</div>
      <div class="item">{{formatNumber(team.time)}}</div>
      <button class="item" v-if="!team.active" @click="startTimer(team)">start</button>
      <button class="item" v-else @click="stopTimer(team)">stop</button>
    </div>
  </div>
</template>

<script>
import SocketIO from 'socket.io-client';

export default {
  name: 'Main',
  data() {
    return {
      teams: [],
      newTeam: '',
      io: null,
    }
  },
  methods: {
    addTeam() {
      const newTeam = {
        name: this.newTeam,
        time: 0
      }
      this.teams.push(newTeam);
      this.io.emit('addTeam', newTeam);
      this.newTeam = '';
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
    formatNumber(n) {
      let minutes = Math.floor(n/600);
      let seconds = Math.floor(n/10 - minutes*60);
      let tens = n - minutes*600 - seconds*10
      if(minutes < 10) minutes = "0"+minutes;
      if(seconds < 10) seconds = "0"+seconds;
      return `${minutes}:${seconds}:${tens}0`
    },
  },
  created() {
    this.io = SocketIO('http://localhost:3000');
    this.io.on('updateTeams',(msg) => {
      this.teams = msg;
    });

    this.io.on('startTimer',(msg) => {
      for (let team of this.teams) {
        if(team.name===msg.name && !team.active) {
          this.startTimer(team, true);
          break;
        }
      }
    });

    this.io.on('stopTimer',(msg) => {
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
  }
}
</script>

<style scoped>
.team {
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-around;
}
.teams {
  width: 100%;
  max-width: 768px;
}
.item {
  flex: 1;
}

</style>
