<template>
  <div class="add">
    <input placeholder="Team name" v-model="newTeam">
    <button @click="addTeam">Add </button>
  </div>
  <div class="teams">
    <div v-for="team in teams" :key="team.name" class="team">
      <div>{{team.name}}</div>
      <div>{{formatNumber(team.time)}}</div>
      <button v-if="!team.active" @click="startTimer(team)">start</button>
      <button v-else @click="stopTimer(team)">stop</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Main',
  props: {
    msg: String
  },
  data() {
    return {
      teams: [],
      newTeam: ''
    }
  },
  methods: {
    addTeam() {
      this.teams.push({
        name: this.newTeam,
        time: 1500
      });
    },
    startTimer(team) {
      if(!team.active) {
        team.interval = setInterval(() => team.time += 1, 100);
        team.active = true
      }
    },
    stopTimer(team) {
      clearInterval(team.interval);
      team.active = false;
    },
    formatNumber(n) {
      let minutes = Math.floor(n/600);
      let seconds = Math.floor(n/10 - minutes*60);
      let tens = n - minutes*600 - seconds*10
      if(minutes < 10) minutes = "0"+minutes;
      if(seconds < 10) seconds = "0"+seconds;
      return `${minutes}:${seconds}:${tens}0`
    },
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
</style>
