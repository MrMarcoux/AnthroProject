<template>
  <div class="tasks cn">    
    <nav class="sidebar active">
        <TaskEditing :task="focusedTask" v-on:dismiss="sidebarDismissed()"/>
    </nav>
    <div class="main-content">
        <ProjectTasksList :tasks="project.tasks" v-on:task-focused="taskEditMenu($event)" />
    </div>
  </div>
</template>

<script lang="ts">
import TaskSelectorModal from './TaskSelectorModal.vue';
import ProjectTasksList from './ProjectTasksList.vue';
import TaskEditing from './TaskEditing.vue';
import MemberSelectorModal from './MemberSelectorModal.vue';
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
    MemberSelectorModal
  }
})
export default class Tasks extends Vue {
  @Prop({type: Object as () => ProjectModel})
  public project!: ProjectModel;
  
  focusedTask: TaskModel;

  constructor() {
    super();
    this.focusedTask = this.project.tasks[1];
  }

  taskEditMenu(task: TaskModel) {
    $('.sidebar').toggleClass('active');
    this.focusedTask = task;
  }

  sidebarDismissed() {
    $('.sidebar').addClass('active');
  }

}
</script>

<style scoped>

@media (max-width: 768px) {
    .sidebar {
        margin-left: -75px;
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
    margin-left: -250px;
}

.sidebar {
    width: 250px;  
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

</style>