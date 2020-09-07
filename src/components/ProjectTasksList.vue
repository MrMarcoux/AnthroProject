<template>
  <div class="tasks-list cn">    
    <button v-on:click="emitTaskChosen()" class="btn btn-info"> Trigger sidebar </button>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { Task as TaskModel } from '@/models/task';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import $ from 'jquery';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as bootstrap from 'bootstrap';

@Component
export default class ProjectTasksList extends Vue {
  @Prop({type: Object as () => TaskModel[]})
  public tasks!: TaskModel[];

  constructor() {
    super();    
  }

  emitTaskChosen() {
      this.$emit('task-focused', this.tasks[0]);
  }

}
</script>

<style scoped>

</style>