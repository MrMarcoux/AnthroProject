<template>
  <div class="tasks cn">    
    <nav v-show="focusedTask != null" class="sidebar">
        <TaskEditing :task="focusedTask" v-on:dismiss="sidebarDismissed()"/>
    </nav>
    <div class="main-content">
        <ProjectTasksList ref="taskList" :project="project" v-on:task-focused="taskEditMenu($event)" v-on:task-deleted="taskDeleted($event)" />
    </div>
  </div>
</template>

<script lang="ts">
import TaskSelectorModal from './TaskSelectorModal.vue';
import ProjectTasksList from './ProjectTasksList.vue';
import TaskEditing from './TaskEditing.vue';
import { Component, Vue, Prop } from 'vue-property-decorator';
import { Project as  ProjectModel} from '../models/project';
import { Task as TaskModel } from '../models/task';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import $ from 'jquery';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as bootstrap from 'bootstrap';

@Component({
  components: {
    TaskSelectorModal,
    ProjectTasksList,
    TaskEditing,
  }
})
export default class Tasks extends Vue {
  @Prop({type: Object as () => ProjectModel})
  public project!: ProjectModel;
  
  focusedTask: TaskModel | null;

  constructor() {
    super();
    this.focusedTask = this.project.tasks.length > 0 ? this.project.tasks[0] : null;
  }

  taskEditMenu(task: TaskModel) {
    
    if (this.focusedTask === task) {
      (this.$refs.taskList as ProjectTasksList).resetSelection();
      $('.sidebar').toggleClass('active');
      (this.$refs.taskList as ProjectTasksList).resetSelection();
    } else {
      $('.sidebar').removeClass('active');
      this.focusedTask = task;
    }
  }

  taskDeleted(task: TaskModel) {
    if (this.focusedTask === task) { 
      (this.$refs.taskList as ProjectTasksList).resetSelection();
      $('.sidebar').removeClass('active');  
    }
  }

  sidebarDismissed() {
    $('.sidebar').addClass('active');
    (this.$refs.taskList as ProjectTasksList).resetSelection();
  }

}
</script>

<style scoped>

@media (max-width: 768px) {
    .sidebar {
        margin-left: -250px;
        top: 0;
        left: 0;
        height: 100vh;
        z-index: 999;
        transition: all 0.3s;
    }

    .sidebar.active {
        margin-left: 0px;
    }
}

.sidebar.active {
    margin-left: -450px;
}

.sidebar {
    width: 450px;  
    height: 100vh;
    transition: all 0.3s;
    background-color: rgb(43, 44, 44);
    border-color: black;
    color: white;
    border-right-width: 50px;
}

.tasks {
    display: flex;
    width: 100%;
}

.main-content {
    display: flex;
    width: 100%;
}


</style>