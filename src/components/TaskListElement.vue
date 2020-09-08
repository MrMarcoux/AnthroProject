<template>
  <div class="task-list-element cn card">
    <div class="card-header" :id="`heading${this.task.uuid.replace('-', '')}`" v-bind:class="{ 'selected-header' : this.selected }">
      <h5 class="mb-0">
        <button v-on:click="toggleExpansion()" v-show="this.task.subTasks.length > 0" class="btn left-side-btn" title="Expand" data-toggle="collapse" :data-target="`#collapse${this.task.uuid.replace('-', '')}`" aria-expanded="true" :aria-controls="`collapse${this.task.uuid.replace('-', '')}`">
          <font-awesome-icon v-show="!expanded" :icon="['fas', 'chevron-down']"/>
          <font-awesome-icon v-show="expanded" :icon="['fas', 'chevron-up']"/>
        </button>
        <button v-show="checkmarks" v-on:click="toggleTaskCompletion()" class="btn check-btn" title="Mark as completed" v-bind:class="{unchecked: !this.task.completed, checked: this.task.completed}" :id="`check${this.task.uuid.replace('-', '')}`">
          <font-awesome-icon :icon="['fas', 'check']"/> 
        </button>
        <button v-bind:class="{barred: task.completed && checkmarks}" v-on:click="toggleSelectedTask(task)" class="btn center-btn">
          {{ this.task.name }}
        </button>
      </h5>
    </div>
    <div :id="`collapse${this.task.uuid.replace('-', '')}`" v-show="this.task.subTasks.length > 0" class="collapse" :aria-labelledby="`heading${this.task.uuid.replace('-', '')}`">
      <div class="card-body">
        <div v-for="subtask in this.task.subTasks" :key="subtask">
          <TaskListElement v-on:task-clicked="toggleSelectedTask($event)" ref="taskElem" :checkmarks="checkmarks" :multiple="multiple" :task="subtask" />
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

/*Vue.config.errorHandler = function (err, vm, info)  {
  alert('[Global Error Handler]: Error in ' + info + ': ' + err);
};*/

@Component({
  name: 'TaskListElement'
})
export default class TaskListElement extends Vue {
  @Prop({type: Object as () => TaskModel})
  public task!: TaskModel;

  @Prop({type: Object as () => boolean})
  public multiple!: boolean;

  @Prop({type: Object as () => boolean})
  public checkmarks!: boolean;

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
    if (!this.multiple) {
      this.setActivationFor(task);
    } else if (this.task === task) {
      this.selected = !this.selected;
    }

    this.$emit('task-clicked', task);
  }

  setActivationFor(task: TaskModel | null) {
    this.selected = (this.task === task);

    if (this.task.subTasks.length === 0) {
      return;
    }

    for (const elem of (this.$refs.taskElem as TaskListElement[])) {
      elem.setActivationFor(task);
    }
  }

  setActivationForMultiple(tasks: TaskModel[]) {
    this.selected = tasks.includes(this.task);

    if (this.task.subTasks.length === 0) {
      return;
    }

    for (const elem of (this.$refs.taskElem as TaskListElement[])) {
      elem.setActivationForMultiple(tasks);
    }
  }

  toggleExpansion() {
    this.expanded = !this.expanded;
  }

  toggleTaskCompletion() {
    this.task.completed = !this.task.completed; 
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
.checked {
    background-color: black;
}

.checked:hover {
    background-color: black;
}

.unchecked {
    background-color: white;
}

.unchecked:hover {
    background-color: black;
}

.check-btn {
    border-color: black;
    width: 25px;
    height: 25px;
    padding: 0px;
    color: white;
    margin-right:7.5px;
    float: right;
}

.check-btn:hover {
    opacity: 85%;
}

.header-btn {
    margin:7.5px;
}

.clickable:hover {
  opacity: 85%;
  cursor: pointer;
}

.barred {
  text-decoration: line-through;
  opacity: 45%;
}
</style>