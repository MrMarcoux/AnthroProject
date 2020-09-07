<template>
  <div class="task-list-element cn card">
    <div class="card-header" :id="`heading${this.task.uuid.replace('-', '')}`" v-bind:class="{ 'selected-header' : this.selected }">
      <h5 class="mb-0">
        <button v-on:click="toggleExpansion()" v-show="this.task.subTasks.length > 0" class="btn left-side-btn" title="Expand" data-toggle="collapse" :data-target="`#collapse${this.task.uuid.replace('-', '')}`" aria-expanded="true" :aria-controls="`collapse${this.task.uuid.replace('-', '')}`">
          <font-awesome-icon v-show="!expanded" :icon="['fas', 'chevron-down']"/>
          <font-awesome-icon v-show="expanded" :icon="['fas', 'chevron-up']"/>
        </button>
        <button v-on:click="toggleSelectedTask(task)" class="btn center-btn">
          {{ this.task.name }}
        </button>
      </h5>
    </div>
    <div :id="`collapse${this.task.uuid.replace('-', '')}`" v-show="this.task.subTasks.length > 0" class="collapse" :aria-labelledby="`heading${this.task.uuid.replace('-', '')}`">
      <div class="card-body">
        <div v-for="subtask in this.task.subTasks" :key="subtask">          
          <TaskListElement v-on:task-clicked="toggleSelectedTask($event)" :multiple="mutiple" :task="subtask" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { Task as TaskModel } from '@/models/task';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import $ from 'jquery';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as bootstrap from 'bootstrap';

Vue.config.errorHandler = function (err, vm, info)  {
  alert('[Global Error Handler]: Error in ' + info + ': ' + err);
};

@Component({
  name: 'TaskListElement'
})
export default class TaskListElement extends Vue {
  @Prop({type: Object as () => TaskModel})
  public task!: TaskModel;

  @Prop({type: Object as () => boolean})
  public multiple!: boolean;

  lastFocusedTask: TaskModel | null;
  selected: boolean;
  expanded: boolean;
  
  constructor() {
    super();
    this.lastFocusedTask = null;
    this.selected = false;
    this.expanded = false;
  }

  toggleSelectedTask(task: TaskModel) {
    if (this.task === task) {
      this.selected = !this.selected;
    } else if (!this.multiple) {
      this.selected = false;
    }

    this.$emit('task-clicked', task);
  }

  setActivationFor(task: TaskModel) {
    this.selected = (this.task === task);

    for (const elem of (this.$refs.taskElem as TaskListElement[])) {
      elem.setActivationFor(task);
    }
  }

  setActivationForMultiple(tasks: TaskModel[]) {
    this.selected = tasks.includes(this.task);

    for (const elem of (this.$refs.taskElem as TaskListElement[])) {
      elem.setActivationForMultiple(tasks);
    }
  }

  toggleExpansion() {
    this.expanded = !this.expanded;
  }
}
</script>

<style scoped>
.panel-heading {
  background-color: rgb(43, 44, 44);
  border-color: black;
  
  padding: 10px;
  margin: 0px;
}


.modal-header button {
  color: white;
}

.panel-title a {
  color: white;
}

li {
    border-top-width: 1px;
    border-bottom-width: 1px;
    border-color: black;
    color: black;
}

.left-side-btn {
  float: left;
}

.center-btn {
  float: left;
}

.selected-header {
  background-color: rgb(43, 44, 44);
  color: white;
}

.selected-header button {
  color: white;
}
</style>