<template>
  <div id="app">
    <div id="nav" v-if="this.$store.state.showNav">
      <div class="navBtn" @click="routrGo('/home',1)" :class="this.$store.state.navType==1?'navAct':''">blog</div>
      <div class="navBtn" @click="routrGo('/music',2)" :class="this.$store.state.navType==2?'navAct':''">music</div>
      <div class="navBtn" @click="routrGo('/postman',3)" :class="this.$store.state.navType==3?'navAct':''">postman</div>
      <div class="navBtn" @click="routrGo('/about',4)" :class="this.$store.state.navType==4?'navAct':''">about</div>
    </div>
    <div id="view">
      <keep-alive v-if="$route.meta.keepAlive">
        <router-view/>
      </keep-alive>
      <router-view v-else/>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {

    }
  },
  created() {

  },
  methods: {
    routrGo(d, t) {
      this.$store.state.navType = t
      this.$router.push(d)
    }
  }
}
</script>
<style lang="less">
body{
  padding: 0;
  margin: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  display: flex;
}
#nav {
  height: 100vh;
  width: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: sticky;
  top: 0;
  .navBtn{
    width: 100%;
    height: 50px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: lavender;
    margin-bottom:5px ;
    cursor: pointer;
    transition: all 0.5s;
    border-radius: 0 10px 10px 0;
    background: linear-gradient(to right, #42b983 , white);
  }
  .navAct{
    transition: all 0.5s;
    width: 175px;
    font-size: bold;
    background: linear-gradient(to right, #42b983 , white);
  }
}
#view{
  position: relative;
  flex: 1;
}
</style>
