<template>
  <div class="tasks-list cn">
    <TaskListElement v-on:task-clicked="emitTaskChosen($event)" v-on:task-delete-requested="deleteTask($event)" :checkmarks="true" ref="taskElem" :multiple="false" :task="task" v-for="task in this.tasks" :key="task" />
    <button type="button" class="btn btn-info btn-lg btn-create" v-on:click="newTaskWindow()">
      <span>
        <b>+</b>
        <span class="hidden-btn-message"> Create a new task </span>
      </span>
    </button>
    <TaskCreationModal ref="taskCreator" v-on:task-created="addTask($event)" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { Task as TaskModel } from '@/models/task';
import { Project as ProjectModel } from '@/models/project';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import $ from 'jquery';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as bootstrap from 'bootstrap';
import TaskListElement from './TaskListElement.vue';
import TaskCreationModal from './TaskCreationModal.vue';

@Component({
  components: {
    TaskListElement,
    TaskCreationModal
  }
})
export default class ProjectTasksList extends Vue {  
  tasks: TaskModel[];

  @Prop({type: Object as () => ProjectModel})
  public project!: ProjectModel;

  constructor() {
    super();
    this.tasks = this.project.tasks;    
  }

  mounted() {
    this.resetSelection();
  }

  emitTaskChosen(task: TaskModel) {
    this.$emit('task-focused', task);
    
    if (this.$refs.taskElem === undefined) {
      return;
    }
    
    for (const elem of (this.$refs.taskElem as TaskListElement[])) {
      elem.setActivationFor(task);
    }
  }

  deleteTask(task: TaskModel) {
    this.$emit('task-deleted', task);
    this.project.removeTask(task);
    this.tasks = this.project.tasks;
  }

  public resetSelection() {
    if (this.$refs.taskElem === undefined) {
      return;
    }

    for (const elem of (this.$refs.taskElem as TaskListElement[])) {
      elem.setActivationFor(null);
    }
  }

  newTaskWindow() {
    (this.$refs.taskCreator as TaskCreationModal).show();
  }

  addTask(task: TaskModel) {
    this.project.addTask(task);

  }
}
</script>

<style scoped>
.tasks-list{
  width: 100%;
}

.btn-create {
  position: absolute;
  bottom: 10px; 
}

button:hover .hidden-btn-message, button.hover .hidden-btn-message {
  visibility: visible;
  display: inline;
}

.hidden-btn-message {
  visibility: hidden;
  display: none;
}
</style>