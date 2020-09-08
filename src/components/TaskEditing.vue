<template>
  <div v-show="this.task" class="task-editing cn">
    <div class="pre-header">
      <font-awesome-icon class="dismiss-icon icon text-left" title="Close the task menu" v-on:click="$emit('dismiss')" :icon="['fas', 'times']" />
    </div>
    <div class="header d-flex w-100 justify-content-between">
      <div class="d-flex w-100">
        <button class="btn check-btn header-btn" title="Mark as completed" v-bind:class="{unchecked: !task.completed, checked: task.completed}" v-on:click="toggleTaskCompletion(task)" :id="`check${task.uuid.replace('-', '')}`">
          <font-awesome-icon :icon="['fas', 'check']"/>
        </button>
        <h3 v-on:click="editNameWindow()"> {{ task.name }} </h3>
      </div>
      <font-awesome-icon class="edit-title-icon icon" title="Edit task title" v-on:click="editNameWindow()" :icon="['fas', 'pen']" />
    </div>
    <div class="scrollmenu">
          <a class="nav-active" v-on:click="switchView('details')" id="detailsTab" href="#">Details</a>
          <a class="" v-on:click="switchView('assignees')" id="assigneesTab" href="#">Assignees</a>
          <a class="" v-on:click="switchView('subtasks')" id="subtasksTab" href="#">Subtasks</a>
          <a class="" v-on:click="switchView('progression')" id="progressionTab" href="#">Predecessors</a>
          <a class="" v-on:click="switchView('skills')" id="skillsTab" href="#">Skills</a>
    </div>
    <div class="body">
      <div v-show="activeSection == 'details'">
        <h4 class="sub-header text-left"> Description </h4>
        <div class="sub-body d-flex w-100 justify-content-between" v-on:click="editDescriptionWindow()">
          <p class="text-left" style="white-space: pre-line"> {{ task.description }} </p>
          <font-awesome-icon class="edit-desc-icon icon" title="Edit task description" :icon="['fas', 'pen']" />
        </div>
        <hr/>
        <h4 class="sub-header text-left"> Scheduling </h4>
        <ul class="list-group">
          <li class="list-group-item d-flex w-100 justify-content-between">
            Start date:
            <input type="date" id="startDate" v-on:change="changeValue('startDate')" :value="formatDateForDisplay(task.start)" />
          </li>
          <li class="list-group-item d-flex w-100 justify-content-between">
            End date:
            <input type="date" id="endDate" v-on:change="changeValue('endDate')" :value="formatDateForDisplay(task.end)" />
          </li>
        </ul>
        <hr/>
        <h4 class="sub-header text-left"> Completion (%) </h4>
        <div class="sub-body ">
          <div id="slider"></div>
        </div>
      </div>
      <div v-show="activeSection == 'assignees'">
        <br>
        <ul class="list-group list-group-flush">
          <li class="list-group-item outsider-elem d-flex justify-content-between" v-for="member in this.task.assignees" :key="member">
            <router-link style="text-decoration: none; color: inherit;" v-bind:to="`/members/${member.uuid}`">  {{ member.name }} </router-link> 
            <font-awesome-icon class="delete-icon icon" title="Unassign this employee" v-on:click="deleteAssignee(member)" :icon="['fas', 'trash']" />
          </li>
        </ul>        
        <button type="button" class="btn btn-info btn-lg" v-on:click="newAssigneeWindow()">
          <span>
            <b>+</b> 
            <span class="hidden-btn-message"> Add a new assignee </span>
          </span>
        </button>
        <TaskMemberSelectorModal ref="assigneeSelector" :task="task" :members="assignableMembers()" v-on:members-selected="addAssignees($event)" />
      </div>
      <div v-show="activeSection == 'subtasks'">
        <br>
        <ul class="list-group list-group-flush">
          <li class="list-group-item outsider-elem d-flex justify-content-between" v-for="subtask in this.task.subTasks" :key="subtask">
            <div>
            <button class="btn check-btn" title="Mark as completed" v-bind:class="{unchecked: !subtask.completed, checked: subtask.completed}" v-on:click="toggleTaskCompletion(subtask)" :id="`check${subtask.uuid.replace('-', '')}`">
              <font-awesome-icon :icon="['fas', 'check']"/> 
            </button>
            <a style="color: inherit;" v-bind:class="{barred: subtask.completed}" href="#" v-on:click="focusOnTask(subtask)">  {{ subtask.name }} </a>
            </div>
            <font-awesome-icon class="delete-icon icon" title="Unassign this employee" v-on:click="deleteSubTask(subtask)" :icon="['fas', 'trash']" />
          </li>
        </ul>
        <button type="button" class="btn btn-info btn-lg" v-on:click="newSubTaskWindow()">
          <span>
            <b>+</b>
            <span class="hidden-btn-message"> Create a new sub-task </span>
          </span>
        </button>
        <TaskCreationModal ref="subtaskCreator" v-on:task-created="addSubTask($event)" />
      </div>

      <div v-show="activeSection == 'progression'">
        <ul class="list-group list-group-flush">
          <li class="list-group-item outsider-elem d-flex justify-content-between" v-for="predecessor in this.task.predecessors" :key="predecessor">
            <div>
              <button class="btn check-btn" title="Mark as completed" v-bind:class="{unchecked: !predecessor.completed, checked: predecessor.completed}" v-on:click="toggleTaskCompletion(predecessor)" :id="`check${predecessor.uuid.replace('-', '')}`">
                <font-awesome-icon :icon="['fas', 'check']"/>
              </button>
              <a style="color: inherit;" v-bind:class="{barred: predecessor.completed}" href="#" v-on:click="focusOnTask(predecessor)">  {{ predecessor.name }} </a>
            </div>
            <font-awesome-icon class="delete-icon icon" title="Unassign this employee" v-on:click="deletePredecessor(predecessor)" :icon="['fas', 'trash']" />
          </li>
        </ul>
        <button type="button" class="btn btn-info btn-lg" v-on:click="newPredecessorWindow()">
          <span>
            <b>+</b>
            <span class="hidden-btn-message"> Create a new sub-task </span>
          </span>
        </button>
        <TaskSelectorModal ref="predecessorSelector" :project="this.task.project" :preselected="this.task.predecessors" v-on:tasks-selected="updatePredecessors($event)" />
        
      </div>

      <div v-show="activeSection == 'skills'">
        <br>
        <ul class="list-group list-group-flush">
          <li class="list-group-item" v-for="skill in this.task.requiredSkills" :key="skill">
            <div class="d-flex justify-content-between">
              <span style="text-decoration: none; color: inherit;">  {{ skill.name }} </span>             
              <font-awesome-icon class="delete-icon icon" title="Unassign this employee" v-on:click="deleteSkill(skill)" :icon="['fas', 'trash']" />
            </div>
            <div class="d-flex justify-content-between">
              <span style="text-decoration: none; color: inherit;"> Required level: </span>
              <input class="form-control level-selector" type="number" v-model="skill.level">
            </div>
          </li>
        </ul>
        <button type="button" class="btn btn-info btn-lg" v-on:click="newSkillWindow()">
          <span>
            <b>+</b>
            <span class="hidden-btn-message"> Add a new required skill </span>
          </span>
        </button>
        <SkillAdditionModal ref="skillAdditor" :preselected="this.task.requiredSkills.map(s => s.name)" v-on:skills-selected="updateSelectedSkills($event)" />
      </div>
    </div>

    <div class="modal fade" id="editDescriptionWindow" tabindex="-1" role="dialog" aria-labelledby="editDescriptionWindowCenterTitle" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title"> Edit task description </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <textarea class="form-control" id="taskDescriptionEdit" placeholder="Enter task description" :value="task.description" />
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Dismiss</button>
            <button type="button" class="btn btn-info" data-dismiss="modal" v-on:click="applyDescriptionChange($event)"> Save changes </button>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="editNameWindow" tabindex="-1" role="dialog" aria-labelledby="editNameWindowCenterTitle" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title"> Edit task name </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <input type="text" class="form-control" id="taskNameEdit" placeholder="Enter task name" :value="task.name">
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Dismiss</button>
            <button type="button" class="btn btn-info" data-dismiss="modal" v-on:click="applyTaskNameChange()"> Save changes </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { Task as TaskModel } from '@/models/task';
import { Skill as SkillModel, Skill } from '@/models/skill';
import { Member as MemberModel } from '@/models/member';
import TaskMemberSelectorModal from '@/components/TaskMemberSelectorModal.vue';
import SkillAdditionModal from '@/components/SkillAdditionModal.vue';
import TaskCreationModal from '@/components/TaskCreationModal.vue';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import $ from 'jquery';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as bootstrap from 'bootstrap';
import 'round-slider/dist/roundslider.min.css';
import 'round-slider/dist/roundslider.min.js';
import TaskSelectorModal from './TaskSelectorModal.vue';


@Component({
  components: {
    TaskMemberSelectorModal,
    SkillAdditionModal,
    TaskCreationModal,
    TaskSelectorModal
  }
})
export default class TaskEditing extends Vue {

  readonly sections = ['details', 'assignees', 'subtasks', 'progression', 'skills'];
  activeSection: string;

  @Prop({type: Object as () => TaskModel})
  public task!: TaskModel | null;
  completion: number|undefined = this.task? this.task.completionPercent : 0;
  
  constructor() {
    super();
    this.activeSection = this.sections[0];
    
  }

  mounted() {

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ($("#slider") as any).roundSlider({
      sliderType: "min-range",
      handleShape: "round",
      width: 22,
      radius: 100,
      value: this.task? this.task.completionPercent : 0
    });

    $('.rs-inner')[0].setAttribute('style', 'background-color: rgb(43, 44, 44);');
    
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const comp = this;
    $("#slider .rs-tooltip-text").on('DOMSubtreeModified', function () {
        const text = $("#slider .rs-tooltip-text")[0].textContent;

        if (text === null) {
          return;
        }

        if (text.length === 0) {
          return;
        }

        if (parseInt(text) === 0) {
          return;
        }
        
        if (comp.task != null) {
          comp.task.completionPercent = parseInt(text);
        }        
    });
  }

  updated() {
    if (this.task === null) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ($("#slider") as any).roundSlider({
      value: this.task.completionPercent
    });
  }

  deleteAssignee(member: MemberModel) {
    if (this.task === null) {
      return;
    }

    this.task.removeAssignee(member);    
  }

  formatDateForDisplay(date: Date): string {
    return date.getFullYear() + "-" +
           ((date.getMonth() + 1).toString().length > 1 ? (date.getMonth() + 1) : "0" + (date.getMonth() + 1) ) + "-" +
           ((date.getDate()).toString().length > 1 ? (date.getDate()) : "0" + (date.getDate()));
  }

  applyDescriptionChange() {
    if (this.task === null) {
      return;
    }

    this.task.description = (String)($('#taskDescriptionEdit').val());
  }

  editDescriptionWindow() {    
    $('#editDescriptionWindow').modal('show');
  }

  editNameWindow() {
    $('#editNameWindow').modal('show');
  }

  applyTaskNameChange() {
    if (this.task === null) {
      return;
    }

    this.task.name = (String)($('#taskNameEdit').val());
  }

  changeValue(id: string) {
    if (this.task === null) {
      return;
    }

    const newDate = new Date(Date.parse($(`#${id}`).val() as string) + 1);
    newDate.setDate(newDate.getDate() + 1);
    
    if (id.includes('end')) {
      this.task.end = newDate;      
    } else if (id.includes('start')) {
      this.task.start = newDate;
    }
  }

   setAllUnactive() {
    for (const section of this.sections) {
        const element = document.getElementById(section + 'Tab');
        if (element !== null) {
            element.classList.remove('nav-active');
        }
    }      
  }

  switchView(section: string) {
    this.setAllUnactive();
    const element = document.getElementById(section + 'Tab');
    if (element !== null) {
        element.classList.toggle('nav-active');
    }
    this.activeSection = section;
  }

  newAssigneeWindow() {
    (this.$refs.assigneeSelector as TaskMemberSelectorModal).show();
  }

  assignableMembers() {
    if (this.task === null) {
      return;
    }

    let assignableMembers: MemberModel[] | undefined = [];
    const teamMembers = this.task.project?.team?.members;

    if (teamMembers ===  undefined) {
      assignableMembers = this.task.project?.outsiders;
    } else {
      assignableMembers = [...new Set(this.task.project?.outsiders.concat(this.task.project?.team?.members as MemberModel[]))];
    }

    return assignableMembers?.filter(member => !this.task?.assignees.includes(member));
  }

  addAssignees(members: MemberModel[]) {
    if (this.task === null) {
      return;
    }

    this.task.tryAssignMembers(members);
  }

  focusOnTask(subtask: TaskModel) {
    this.task = subtask;
  }

  deleteSubTask(subtask: TaskModel) {
    this.task?.removeSubtask(subtask);
  }

  deleteSkill(skill: SkillModel) {
    this.task?.removeSkill(skill);
  }

  newSubTaskWindow() {
    (this.$refs.subtaskCreator as TaskCreationModal).show();
  }

  newSkillWindow() {
    (this.$refs.skillAdditor as SkillAdditionModal).show();
  }

  updateSelectedSkills(skillNames: string[]) {
    if (this.task === null) {
      return;
    }

    this.task.requiredSkills = this.task.requiredSkills.filter(skill => skillNames.includes(skill.name));
    
    skillNames.filter(name => !this.task?.requiredSkills.map(s => s.name).includes(name))
              .forEach(name => this.task?.requiredSkills.push(new Skill(name, 0)));
  }

  toggleTaskCompletion(task: TaskModel) {
    task.completed = !task.completed;
  }

  addSubTask(subtask: TaskModel) {
    this.task?.addSubTask(subtask);
  }

  deletePredecessor(predecessor: TaskModel) {
    if (this.task === null) {
      return;
    }

    this.task.predecessors = this.task.predecessors.filter(pre => pre != predecessor); 
  }

  newPredecessorWindow() {
    (this.$refs.predecessorSelector as TaskSelectorModal).show();
  }

  updatePredecessors(predecessors: TaskModel[]) {
    this.task?.updatePredecessors(predecessors);
  }
}
</script>

<style scoped>

.header {
  padding-top: 0.5em;
  padding-bottom: 0.5em;
  padding-right: 0.25em;
  color: white;
}

.header h3 {
  padding-left: 0.25em;
}

.icon {
  cursor: pointer;
}

.dismiss-icon {
  float: right;
  margin: 10px;
  font-size: 1.2em;
}

.icon:hover {
  opacity: 75%;
}

div.scrollmenu {
  scrollbar-width: thin;
  background-color: #333;
  overflow: auto;
  white-space: nowrap;
}

div.scrollmenu a {
  display: inline-block;
  color: white;
  text-align: center;
  padding: 14px;
  text-decoration: none;
  transition: 0.2s;
}

div.scrollmenu a:hover {
  background-color: #777;
}

.nav-active {
  background-color: #777;
}

.sub-header {
  padding: 0.25em;
}

.sub-body {
  padding: 0.75em;
  padding-top: 0;
  cursor: pointer;
}

.list-group-item {
  background-color: inherit;
}

input[type=date]:hover {
  cursor: pointer;
}

button:hover .hidden-btn-message, button.hover .hidden-btn-message {
  visibility: visible;
  display: inline;
}

.hidden-btn-message {
  visibility: hidden;
  display: none;
}

.level-selector {
  font-size: 85%;
  width: 45px;
  height: 25px;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type=number] {
  -moz-appearance: textfield;
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