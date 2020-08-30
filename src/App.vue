<template>
  <div id="app">
    <div v-show="this.$store.state.initialized">
      <router-view/>
    </div>
    <div v-show="!this.$store.state.initialized">
      <Initialization/>
    </div>
  </div>
</template>

<script>
import Initialization from '@/components/Initialization.vue'

export default {
  name: 'App',
  data() {
    return {
      initialized: this.$store.state.initialized
    }
  },
  components: {
    Initialization
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
