<template>
  <div class="task-selector-modal cn">    
    <div class="modal fade" id="selectTaskWindow" tabindex="-1" role="dialog" aria-labelledby="selectTaskWindowCenterTitle" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title"> Select tasks </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div v-show="project.tasks.length === 0">
                No tasks are available for selection
            </div>
            <div>
              <TaskListElement v-on:task-clicked="toggleSelectedTask($event)" :multiple="true" :task="task" v-for="task in this.project.tasks" :key="task" />                
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal"> Dismiss </button>
            <button type="button" class="btn btn-info" v-on:click="confirmSelection()" data-dismiss="modal"> Confirm </button>
          </div>
        </div>
      </div>
    </div>
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

@Component({
  components: {
    TaskListElement
  }
})
export default class TaskSelectorModal extends Vue {
  @Prop({type: Object as () => ProjectModel})
  public project!: ProjectModel;

  tasks: TaskModel[];

  constructor() {
    super();
    this.tasks = [];    
  }

  public show(): void {
    $('#selectTaskWindow').modal('show');
  }

  public hide(): void {
    $('#selectTaskWindow').modal('hide');
  }

  confirmSelection() {
    //TODO: Transfer selection to thing or wathever
    alert(this.tasks.map(task => task.name));
  }

  toggleSelectedTask(task: TaskModel) {    
    if (this.tasks.includes(task)) {
      this.tasks = this.tasks.filter(t => t !== task); 
    } else {
      this.tasks.push(task);
    }
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

.modal-header {
    background-color: rgb(43, 44, 44);
    color: white;
}

.modal-header button {
  color: white;
}

.panel-title a {
  color: white;
}
</style>