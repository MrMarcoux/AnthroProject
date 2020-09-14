<template>
  <div class="model cn">
    <div class="inner">
      <div class="app-header container-fluid">
        <div class="row">
          <div class="col-1"></div>
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
          <a class="nav-link active" v-on:click="switchView('projects')" id="projectsTab" href="#">Projects</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" v-on:click="switchView('teams')" id="teamsTab" href="#">Teams</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" v-on:click="switchView('members')" id="membersTab" href="#">Members</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" v-on:click="switchView('availableSkills')" id="availableSkillsTab" href="#">Available skills</a>
        </li>
      </ul>
      <div v-show="activeSection == 'projects'">
        <div class="list-group">
          <a href="#" class="list-group-item list-group-item-action flex-column align-items-start model-elem" v-bind:style="`border-left-color: #${ project.colorCode };`" v-for="project in this.$store.state.model.projects" :key="project.uuid">
              <router-link style="text-decoration: none; color: inherit;" v-bind:to="'/projects/' + project.uuid">
                  <div class="d-flex w-100 justify-content-between">
                      <h5 class="mb-1 model-elem-title"><b> {{ project.name }} </b></h5>                        
                      <small> {{ project.tasks.length }} tasks </small>
                  </div>
                  <br>
                  <div class="d-flex w-100 justify-content-between"> {{ project.description }} </div>
                  <br>
                  <small class="d-flex w-100 justify-content-between"> Completion: </small>
                  <div class="progress justify-content-right" style="width: 200px;">
                      <div class="progress-bar bg-info" role="progressbar" v-bind:style="`width: ${project.completionRatio() * 100}%`" aria-valuemin="0" aria-valuemax="100">  
                          {{ project.completionRatio() * 100 }} %
                      </div>
                  </div>
              </router-link>
          </a>
        </div>
        <br>
        <br>
        <button type="button" class="btn btn-create btn-info btn-lg" v-on:click="projectCreationWindow()">
          <span>
            <b>+</b> <span class="hidden-btn-message"> Create a new project </span>
          </span>
        </button>
        <ProjectCreationModal ref="projectCreator" v-on:project-created="addProject($event)" />
      </div>
      <div v-show="activeSection == 'teams'">
        <div class="list-group">
            <a href="#" class="list-group-item list-group-item-action flex-column align-items-start model-elem" v-bind:style="`border-left-color: #${ team.colorCode };`" v-for="team in this.$store.state.model.teams" :key="team.uuid">
                <router-link style="text-decoration: none; color: inherit;" v-bind:to="'/teams/' + team.uuid">
                    <div class="d-flex w-100 justify-content-between">
                        <h5 class="mb-1 model-elem-title"><b> {{ team.name }} </b></h5>                        
                        <small> {{ team.members.length }} members </small>
                    </div>
                    <br>
                    <div class="d-flex w-100 justify-content-between"> {{ team.description }} </div>
                    <br>                    
                </router-link>
            </a>
          </div>
          <br>
          <br>
          <button type="button" v-on:click="teamCreationWindow()" class="btn btn-create btn-info btn-lg">       
            <span>
             <b>+</b> <span class="hidden-btn-message"> Create a new team </span>
            </span>      
          </button>
          <TeamCreationModal ref="teamCreator" v-on:team-created="addTeam($event)" />
      </div>
      <div v-show="activeSection == 'members'">
          <div class="list-group">
            <a href="#" class="list-group-item list-group-item-action flex-column align-items-start model-elem" v-bind:style="`border-left-color: #${ member.colorCode };`" v-for="member in this.$store.state.model.members" :key="member.uuid">
                <router-link style="text-decoration: none; color: inherit;" v-bind:to="'/members/' + member.uuid">
                    <div class="d-flex w-100 justify-content-between">
                        <h5 class="mb-1 model-elem-title"><b> {{ member.name }} </b></h5>                        
                        <small> {{ member.getCurrentSkills().length }} skills </small>
                    </div>
                    <br>
                    <div class="d-flex w-100 justify-content-between"> {{ member.description }} </div>
                    <br>
                </router-link>
            </a>
          </div>
          <br>
          <br>
          <button type="button" v-on:click="memberCreationWindow()" class="btn btn-create btn-info btn-lg">          
            <span>
             <b>+</b> <span class="hidden-btn-message"> Create a new member </span>
            </span>          
          </button>
          <MemberCreationModal ref="memberCreator" v-on:member-created="addMember($event)" />
      </div>
      <div v-show="activeSection == 'availableSkills'">
          <ul class="list-group list-group-flush">
            <li class="list-group-item model-skill d-flex justify-content-between" v-for="availableSkill in this.$store.state.model.availableSkills" :key="availableSkill">              
              <div class="model-skill-name" v-on:click="editSkillWindow(availableSkill)"> {{ availableSkill }} </div>
              <div class="model-skill-icons">
                <span class="model-skill-icon" title="Edit this skill name">
                  <font-awesome-icon v-on:click="editSkillWindow(availableSkill)" :icon="['fas', 'pen']" /> 
                </span>
                <span class="model-skill-icon" title="Delete this skill">
                  <font-awesome-icon v-on:click="deleteSkillWindow(availableSkill)" :icon="['fas', 'trash']" />
                </span>
              </div>
            </li>
          </ul>
          <br>
          <br>
          <button type="button" class="btn btn-create btn-info btn-lg" v-on:click="newSkillWindow()">
            <span>
              <b>+</b> 
              <span class="hidden-btn-message"> Create a new skill </span>
            </span>
          </button>
      </div>
    </div>
    <div class="modal fade" id="editSkillWindow" tabindex="-1" role="dialog" aria-labelledby="editSkillWindowCenterTitle" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title"> Edit skill name </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <input type="text" class="form-control" id="skillNameEdit" placeholder="Enter skill name" :value="focusedSkill">
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Dismiss</button>
            <button type="button" class="btn btn-info" v-on:click="applySkillNameChange()">Save changes</button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal fade" id="newSkillWindow" tabindex="-1" role="dialog" aria-labelledby="newSkillWindowCenterTitle" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title"> Enter the new skill name </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <input type="text" class="form-control" id="skillNameCreation" placeholder="Enter skill name">
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Dismiss</button>
            <button type="button" class="btn btn-info" v-on:click="applySkillCreation()">Save</button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal fade" id="deleteSkillWindow" tabindex="-1" role="dialog" aria-labelledby="deleteWindowCenterTitle" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title"> Are you sure you want to delete this skill? </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <font-awesome-icon :icon="['fas', 'minus-circle']" class="fa-10x" />
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Dismiss</button>
            <button type="button" class="btn btn-danger" v-on:click="applySkillDeletion()">Delete</button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal fade" id="errorWindow" tabindex="-1" role="dialog" aria-labelledby="errorWindowWindowCenterTitle" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title"> Error </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <p>
            An error occured for the following reason:
            {{ errorMessage }}
            </p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import ProjectCreationModal from '@/components/ProjectCreationModal.vue';
import MemberCreationModal from '@/components/MemberCreationModal.vue';
import TeamCreationModal from '@/components/TeamCreationModal.vue';
import { Project as ProjectModel } from '@/models/project';
import { Member as MemberModel } from '@/models/member';
import { Team as TeamModel } from '@/models/team';
import $ from 'jquery';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as bootstrap from 'bootstrap';

@Component({
  components: {
    ProjectCreationModal,
    MemberCreationModal,
    TeamCreationModal
  }
})
export default class Initialization extends Vue {

  readonly sections = ['projects', 'teams', 'members', 'availableSkills'];
  activeSection: string;
  focusedSkill: string;
  errorMessage: string;

  constructor() {
    super();
    this.activeSection = this.sections[0];
    this.focusedSkill = "";
    this.errorMessage = "";
  }

  deleteSkillWindow(skillName: string) {
    this.focusedSkill = skillName;
    $('#deleteSkillWindow').modal('show');    
    $('#editSkillWindow').modal('hide');
  }

  editSkillWindow(skillName: string) {
    this.focusedSkill = skillName;
    $('#editSkillWindow').modal('show');
  }

  newSkillWindow() {
    $('#newSkillWindow').modal('show');
  }

  applySkillCreation() {
    $('#newSkillWindow').modal('hide');
    const skillName = $('#skillNameCreation').val();

    try {
      this.$store.state.model.addSkill(skillName);
    } catch (Error) {
      this.errorMessage = Error.message;
      $('#errorWindow').modal('show');
    }
  }

  applySkillNameChange() {
    $('#editSkillWindow').modal('hide');
    const newSkillName = $('#skillNameEdit').val();

    try {
      this.$store.state.model.modifySkillName(this.focusedSkill, newSkillName);
    } catch (Error) {
      this.errorMessage = Error.message;
      $('#errorWindow').modal('show');
    }
  }

  applySkillDeletion() {
    $('#deleteSkillWindow').modal('hide');

    try {
      this.$store.state.model.deleteSkill(this.focusedSkill);
    } catch (Error) {
      this.errorMessage = Error.message;
      $('#errorWindow').modal('show');
    }
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

  projectCreationWindow() {
    (this.$refs.projectCreator as ProjectCreationModal).show();
  }

  addProject(project: ProjectModel) {
    this.$store.state.model.projects.push(project);
  }

  memberCreationWindow() {
    (this.$refs.memberCreator as MemberCreationModal).show();
  }

  addMember(member: MemberModel) {
    this.$store.state.model.members.push(member);
  }

  teamCreationWindow() {
    (this.$refs.teamCreator as TeamCreationModal).show();
  }

  addTeam(team: TeamModel) {
    this.$store.state.model.teams.push(team);
  }
}
</script>

<style scoped>
.nav-link {
    color: inherit;
}

.model-elem {
    transition: 0.3s;
    border-left-width: 1em;
}

.model-elem:hover {
    border-left-width: 3em;    
}

.model-elem:hover .model-elem-title, .model-elem.hover .model-elem-title {
     text-decoration: underline;
}

.model-skill {
    transition: 0.3s;
    border-left-width: 1em;
}

.model-skill:hover {
  padding: 1em;
  font-size: 125%;
}

.model-skill:hover .model-skill-icons, .model-skill.hover .model-skill-icons {
     visibility: visible;
}

.model-skill-icons {
  visibility: hidden;
  transition: 0.2s;
}

.model-skill-icon {
  padding: 1em;
}

.model-skill-name:hover {
  cursor: pointer;
}

.model-skill-icon:hover {
  cursor: pointer;
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
