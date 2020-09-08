<template>
  <div class="initialization cn">
    <div class="inner">
      <h2> Please choose one of those options: </h2>
      <button v-on:click="loadProject()" type="button" class="btn btn-primary btn-lg"> Import an existing project </button>
      <br>
      <br>
      <button v-on:click="newProject()" type="button" class="btn btn-primary btn-lg"> Create a new project </button>
      <input id="fileInput" @change="loadProjectFile" type="file" style="display: none" multiple />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Initialization extends Vue {

  constructor() {
    super();
  }
  
  loadProject() {
    const fileInput = document.getElementById('fileInput');
    
    if (fileInput == null) {
      return;
    }

    fileInput.click();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  loadProjectFile(event: any) {
    this.$store.commit('loadFile', event.target.files[0]);
  }

  newProject() {
    this.$store.state.initialized = true;
  }
}
</script>

<style scoped>
.inner {
  padding-top: 15rem;
}
</style>
