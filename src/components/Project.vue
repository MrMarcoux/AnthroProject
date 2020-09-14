<template>
  <div class="project cn">
    <div class="inner">
      <div class="app-header container-fluid">
        <div class="row">
          <div class="col-1">
            <router-link style="text-decoration: none; color: inherit;" v-bind:to="'/'"> 
              <h2 class="text-left go-back">
                <font-awesome-icon :icon="['fas', 'arrow-left']" />
              </h2>
            </router-link> 
          </div>
          <div class="col-10">                    
            <h2> {{ this.$store.state.model.getName() }} </h2>
          </div>
          <div class="col-1">
            <h2 class="text-right go-back icon" v-on:click="$store.dispatch('saveFile')">
              <font-awesome-icon :icon="['fas', 'save']" />
            </h2>
          </div>
        </div>
      </div>
      <ul class="nav nav-tabs">
        <li class="nav-item">
          <a class="nav-link active" v-on:click="switchView('project')" id="projectTab" href="#">Project</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" v-on:click="switchView('tasks')" id="tasksTab" href="#">Tasks</a>
        </li>
        <li class="nav-item" v-on:click="reloadGantt()">
          <a class="nav-link" v-on:click="switchView('gantt')" id="ganttTab" href="#">Gantt diagram</a>
        </li>
      </ul>
      <div v-show="activeSection == 'project'">
        <div class="project-header d-flex w-100 justify-content-between">
          <div class="d-flex">
            <span class="color-picker-wrap" id="colorPickerPlaceholder" :style="`background-color: #${project.colorCode}`" v-on:click="clickColor()"></span>
            <input type="color" :id="`colorPicker${this.project.uuid.replace('-', '')}`">
            <h1 v-on:click="editNameWindow()" class="display-3 text-left project-name" title="Edit name"> 
              {{ project.name }}
            </h1>
          </div>
          <div>
            <font-awesome-icon class="edit-name-icon" title="Edit name" v-on:click="editNameWindow()" :icon="['fas', 'pen']" />
            <font-awesome-icon class="delete-icon" title="Delete this project" v-on:click="deleteProjectWindow()" :icon="['fas', 'trash']" />
          </div>
        </div>
        <hr/>
        <h2 class="description-header text-left" v-on:click="editDescriptionWindow()"> Description </h2>
        <div class="description-body d-flex w-100 justify-content-between" v-on:click="editDescriptionWindow()">
          <p class="text-left" style="white-space: pre-line"> {{ project.description }} </p>
          <font-awesome-icon class="edit-desc-icon" title="Edit project description" :icon="['fas', 'pen']" />
        </div>
        <hr/>
        <h2 class="assigned-teams-header text-left"> Assigned team </h2>
        <div v-if="projectHasTeam">
          <div class="assigned-teams-header d-flex w-100 justify-content-between">
            <router-link style="text-decoration: none; color: inherit;" title="Change team" v-bind:to="`/teams/${teamUuid}`">
              <div class="d-flex">
                <span class="color-display" id="teamColor" :style="`background-color: #${teamColor}`"></span>
                <h2> {{ teamName }} </h2>
              </div>
            </router-link>
            <div>
              <font-awesome-icon class="change-team-icon left-side-icon" title="Change team" v-on:click="chooseTeamWindow()" :icon="['fas', 'exchange-alt']" />
              <font-awesome-icon class="delete-icon" title="Deassign this team from the project" v-on:click="deleteTeam()" :icon="['fas', 'trash']" />
            </div>
          </div>
        </div>
        <div v-if="!projectHasTeam" v-on:click="chooseTeamWindow()">
          No teams have been assigned yet. Click here to add one.          
        </div>
        <TeamSelectorModal ref="teamSelector" v-on:team-selected="teamChanged($event)" :project-uuid="project.uuid" />
        <hr/>
        <h2 class="assigned-individuals-header sub-header text-left" v-on:click="editDescriptionWindow()"> Assigned individuals </h2>
        <ul class="list-group list-group-flush">
          <li class="list-group-item outsider-elem d-flex justify-content-between" v-for="member in this.project.outsiders" :key="member">
            <router-link style="text-decoration: none; color: inherit;" v-bind:to="`/members/${member.uuid}`">  {{ member.name }} </router-link> 
            <font-awesome-icon class="delete-icon" title="Unassign this employee" v-on:click="deleteOutsider(member)" :icon="['fas', 'trash']" />
          </li>
        </ul>
        <MemberSelectorModal ref="outsiderSelector" :members="selectableOutsiders()" v-on:members-selected="addOutsiders($event)"/>
        <button type="button" class="btn btn-create btn-info btn-lg" v-on:click="newOutsiderWindow()">
          <span>
            <b>+</b> 
            <span class="hidden-btn-message"> Add a new individual member </span>
          </span>
        </button>
      </div>
      <div v-show="activeSection == 'tasks'">
        <Tasks :project="project" />
      </div>
      <div v-show="activeSection == 'gantt'">
        <ProjectGanttView ref="ganttView" :project="project" />
      </div>
    </div>
    <div class="modal fade" id="editNameWindow" tabindex="-1" role="dialog" aria-labelledby="editNameWindowCenterTitle" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title"> Edit project name </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <input type="text" class="form-control" id="projectNameEdit" placeholder="Enter project name" :value="project.name">
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Dismiss</button>
            <button type="button" class="btn btn-primary" data-dismiss="modal" v-on:click="applyProjectNameChange()"> Save changes </button>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="editDescriptionWindow" tabindex="-1" role="dialog" aria-labelledby="editDescriptionWindowCenterTitle" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title"> Edit project description </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <textarea class="form-control" id="projectDescriptionEdit" placeholder="Enter project name" :value="project.description" />
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Dismiss</button>
            <button type="button" class="btn btn-primary" data-dismiss="modal" v-on:click="applyDescriptionChange()"> Save changes </button>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="deleteProjectWindow" tabindex="-1" role="dialog" aria-labelledby="deleteProjectWindowCenterTitle" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title"> Are you sure you want to delete this project? </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>          
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">No</button>
            <button type="button" class="btn btn-danger" data-dismiss="modal" v-on:click="deleteProject()"> Delete </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
/*
TODO:
  - task deletion --> Will have to take care of inter-dependencies
*/
import TeamSelectorModal from './TeamSelectorModal.vue';
import MemberSelectorModal from './MemberSelectorModal.vue';
import Tasks from './Tasks.vue';
import ProjectGanttView from './ProjectGanttView.vue';
import { Component, Vue } from 'vue-property-decorator';
import { Project as  ProjectModel } from '@/models/project';
import { Team as TeamModel } from '@/models/team';
import { Member as MemberModel } from '@/models/member';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import $ from 'jquery';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as bootstrap from 'bootstrap';

@Component({
  components: {
    TeamSelectorModal,
    MemberSelectorModal,
    Tasks,
    ProjectGanttView
  }
})
export default class Project extends Vue {

  readonly sections = ['project', 'tasks', 'gantt'];
  activeSection: string;
  focusedSkill: string;
  errorMessage: string;
  project: ProjectModel;
  teamUuid: string;
  teamColor: string;
  teamName: string;
  projectHasTeam: boolean;

  constructor() {
    super();
    this.activeSection = this.sections[0];
    this.focusedSkill = "";
    this.errorMessage = "";
    this.project = this.$store.state.model.projects.find((proj: ProjectModel) => proj.uuid === this.$route.params.uuid);
    //TODO: Will fail in case a team is already associated. Need to modify this.
    this.teamUuid = 'None';
    this.teamColor = '000000';
    this.teamName = '';
    this.projectHasTeam = this.project.hasTeam();
  }

  mounted() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const comp = this;
    $(document).on('change', `#colorPicker${this.project.uuid.replace('-', '')}`, function() {
        comp.colorChanged();
    });
  }

  chooseTeamWindow() {
    (this.$refs.teamSelector as TeamSelectorModal).show();
  }

  teamChanged(team: TeamModel) {
    this.teamUuid = team.uuid;
    this.teamColor = team.colorCode;
    this.teamName = team.name;
    this.projectHasTeam = this.project.hasTeam();
  }

  deleteTeam() {
    this.project.clearTeam();
    this.projectHasTeam = this.project.hasTeam();    
  }

  deleteOutsider(member: MemberModel) {
    this.project.removeOutsider(member);
  }

  editNameWindow() {
    $('#editNameWindow').modal('show');
  }

  applyProjectNameChange() {
    this.project.name = (String)($('#projectNameEdit').val());
  }

  deleteProjectWindow() {
    $('#deleteProjectWindow').modal('show');
  }

  editDescriptionWindow() {
    $('#editDescriptionWindow').modal('show');
  }

  applyDescriptionChange() {
    this.project.description = (String)($('#projectDescriptionEdit').val());
  }

  deleteProject() {
    this.$store.state.model.projects = this.$store.state.model.projects.filter((proj: ProjectModel) => proj != this.project);
    this.$router.push('/');
  }

  setAllUnactive() {
    for (const section of this.sections) {
        const element = document.getElementById(section + 'Tab');
        if (element !== null) {
            element.classList.remove('active');
        }
    }      
  }

  switchView(section: string) {
    this.setAllUnactive();
    const element = document.getElementById(section + 'Tab');
    if (element !== null) {
        element.classList.toggle('active');
    }
    this.activeSection = section;
  }

  clickColor() {
    $(`#colorPicker${this.project.uuid.replace('-', '')}`).click();
  }

  colorChanged() {
    if ($(`#colorPicker${this.project.uuid.replace('-', '')}`).val() === undefined)
        return;
    
    this.project.colorCode = String($(`#colorPicker${this.project.uuid.replace('-', '')}`).val()).split('#')[1];
  }

  newOutsiderWindow() {
    (this.$refs.outsiderSelector as MemberSelectorModal).show();
  }

  selectableOutsiders(): MemberModel {
    return this.$store.state.model.members
               .filter((member: MemberModel) => !this.project.team?.members.includes(member) &&
                                                !this.project.outsiders.includes(member));
  }

  addOutsiders(members: MemberModel[]) {
    this.project.outsiders.push(...members);
  }

  reloadGantt() {    
    (this.$refs.ganttView as ProjectGanttView).refreshGantt();
  }

  saveTest() {
    this.$store.dispatch('saveFile');
  }
  
}
</script>

<style scoped>
.nav-link {
    color: inherit;
}

input[type=color] {
    display: none;
}

.color-picker-wrap {
  border-radius: 50%;
  width: 85px;
  height: 85px; 
  display: inline-block;
  margin-right: 1.5em;
  box-shadow: 2px 2px grey;
}

.outsider-elem {
  border-color: white;
  transition: 0.3s;
}
.outsider-elem:hover {
  border-left-width: 0.5em;
  font-size: 125%;
}

.color-display {
  border-radius: 50%;
  width: 40px;
  height: 40px; 
  display: inline-block;
  margin-right: 1.5em;
}

.color-picker-wrap:hover {
  cursor: pointer;
  opacity: 75%;
}

.project-header {
    padding: 1em;
}

.project-name:hover {
  cursor: pointer;
}

.sub-header {
  padding: 0.25em;
}

.description-header {
  padding: 0.25em;
}

.assigned-teams-header {
  padding: 0.25em;
}

.description-body {
  padding: 0.75em;
  padding-top: 0;
}

.description-header:hover {
  cursor: pointer;
}

.description-body:hover {
  cursor: pointer;
}

.description-body:hover .edit-desc-icon, .description-body:hover .edit-desc-icon {
  opacity: 75%;
}

.delete-icon {
  font-size: 150%;
}

.edit-name-icon {
  font-size: 150%;
  margin-right: 10px;
}

.change-team-icon:hover {
  opacity: 75%;
  cursor: pointer;
}

.left-side-icon {
  font-size: 150%;
  margin-right: 10px;
}

.delete-icon:hover {
  opacity: 75%;
  cursor: pointer;
}

.edit-name-icon:hover {
  opacity: 75%;
  cursor: pointer;
}

.go-back:hover {
  opacity: 75%;
}

button:hover .hidden-btn-message, button.hover .hidden-btn-message {
  visibility: visible;
  display: inline;
}

.hidden-btn-message {
  visibility: hidden;
  display: none;
}

.btn-create {
  position: absolute;
  bottom: 10px; 
}

.modal-header {
    background-color: rgb(43, 44, 44);
    color: white;
}

.modal-header button {
  color: white;
}

.icon:hover {
  cursor: pointer;
  opacity: 75%;
}

</style>