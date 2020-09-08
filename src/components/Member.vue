<template>
  <div class="member cn">
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
          <div class="col-1"></div>
        </div>
      </div>
      <ul class="nav nav-tabs">
        <li class="nav-item">
          <a class="nav-link active" v-on:click="switchView('member')" id="memberTab" href="#">Member</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" v-on:click="switchView('skills')" id="skillsTab" href="#">Skills</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" v-on:click="switchView('upcomingskills')" id="upcomingskillsTab" href="#">Upcoming skills</a>
        </li>
      </ul>
      <div v-show="activeSection == 'member'">
        <div class="member-header d-flex w-100 justify-content-between">
          <div class="d-flex">
            <span class="color-picker-wrap" id="colorPickerPlaceholder" :style="`background-color: #${member.colorCode}`" v-on:click="clickColor()"></span>
            <input type="color" :id="`colorPicker${this.member.uuid.replace('-','')}`">
            <h1 v-on:click="editNameWindow()" class="display-3 text-left member-name" title="Edit name"> 
              {{ member.name }}
            </h1>
          </div>
          <div>
            <font-awesome-icon class="edit-name-icon" title="Edit name" v-on:click="editNameWindow()" :icon="['fas', 'pen']" />
            <font-awesome-icon class="delete-icon" title="Delete this member" v-on:click="deleteMemberWindow()" :icon="['fas', 'trash']" />
          </div>
        </div>
        <hr/>
        <h2 class="description-header text-left" v-on:click="editDescriptionWindow()"> Description </h2>
        <div class="description-body d-flex w-100 justify-content-between" v-on:click="editDescriptionWindow()">
          <p class="text-left" style="white-space: pre-line"> {{ member.description }} </p>
          <font-awesome-icon class="edit-desc-icon" title="Edit member description" :icon="['fas', 'pen']" />
        </div>
        
      </div>
      <div v-show="activeSection == 'skills'">
        <br>
        <ul class="list-group list-group-flush">
          <li class="list-group-item" v-for="skill in this.member.skills" :key="skill">
            <div class="d-flex justify-content-between">
              <span class="skill-name">  {{ skill.name }} </span>             
              <font-awesome-icon class="delete-icon icon" title="Remove this skill" v-on:click="deleteSkill(skill)" :icon="['fas', 'trash']" />
            </div>
            <div class="d-flex">
              <span> Mastery level: </span>
              <input class="form-control level-selector" type="number" v-model="skill.level">
            </div>
          </li>
        </ul>
        <button type="button" class="btn btn-info btn-lg" v-on:click="newSkillWindow()">
          <span>
            <b>+</b>
            <span class="hidden-btn-message"> Add a new skill </span>
          </span>
        </button>
        <SkillAdditionModal ref="memberSkillAdditor" :preselected="this.member.skills.map(skill => skill.name)" v-on:skills-selected="updateSelectedSkills($event)" />
      </div>
      <div v-show="activeSection == 'upcomingskills'">
        <br>
        <ul class="list-group list-group-flush">
          <li class="list-group-item" v-for="skill in this.member.upcomingSkills" :key="skill">
            <div class="d-flex justify-content-between">
              <span class="skill-name">  {{ skill.name }} </span>
              <font-awesome-icon class="delete-icon icon" title="Remove this skill" v-on:click="deleteUpcomingSkill(skill)" :icon="['fas', 'trash']" />
            </div>
            <div class="d-flex justify-content-between upcoming-skill-form">
              <span> Mastery level: </span>
              <input class="form-control level-selector" type="number" v-model="skill.level">
            </div>
            <div class="d-flex justify-content-between upcoming-skill-form">
              <span class="acquisition-date"> Acquisition date: </span>
              <input class="acquisition-date" type="date" v-on:change="changeSkillDate(skill, $event)" :value="skill.formattedDate()" />
            </div>
          </li>
        </ul>
        <button type="button" class="btn btn-info btn-lg" v-on:click="newUpcomingSkillWindow()">
          <span>
            <b>+</b>
            <span class="hidden-btn-message"> Add a new skill </span>
          </span>
        </button>
        <SkillAdditionModal ref="memberUpcomingSkillAdditor" :preselected="[]" v-on:skills-selected="updateSelectedUpcomingSkills($event)" />
      </div>
    </div>

    <div class="modal fade" id="editNameWindow" tabindex="-1" role="dialog" aria-labelledby="editNameWindowCenterTitle" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title"> Edit member name </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <input type="text" class="form-control" id="memberNameEdit" placeholder="Enter project name" :value="member.name">
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Dismiss</button>
            <button type="button" class="btn btn-info" data-dismiss="modal" v-on:click="applyNameChange()"> Save changes </button>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="editDescriptionWindow" tabindex="-1" role="dialog" aria-labelledby="editDescriptionWindowCenterTitle" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title"> Edit member description </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <textarea class="form-control" id="memberDescriptionEdit" placeholder="Enter member description" :value="member.description" />
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Dismiss</button>
            <button type="button" class="btn btn-info" data-dismiss="modal" v-on:click="applyDescriptionChange()"> Save changes </button>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="deleteMemberWindow" tabindex="-1" role="dialog" aria-labelledby="deleteMemberWindowCenterTitle" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title"> Are you sure you want to delete this member? </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>          
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">No</button>
            <button type="button" class="btn btn-danger" data-dismiss="modal" v-on:click="deleteMember()"> Delete </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Member as MemberModel } from '@/models/member';
import { Skill as SkillModel } from '@/models/skill';
import { UpcomingSkill as UpcomingSkillModel } from '@/models/upcomingskill';
import SkillAdditionModal from '@/components/SkillAdditionModal.vue';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import $ from 'jquery';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as bootstrap from 'bootstrap';

@Component({
  components: {
    SkillAdditionModal
  }
})
export default class Member extends Vue {
  readonly sections = ['member', 'skills', 'upcomingskills'];
  activeSection: string;
  member: MemberModel;

  constructor() {
    super();
    this.activeSection = this.sections[0];
    this.member = this.$store.state.model.members.find((mem: MemberModel) => mem.uuid === this.$route.params.uuid);
    this.member.refreshSkills();
}

  mounted() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const comp = this;
    $(document).on('change', `#colorPicker${this.member.uuid.replace('-','')}`, function() {
        comp.colorChanged();
    });
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

  deleteMember() {
    this.$store.state.model.removeMember(this.member);
    this.$router.push('/');
  }

  applyDescriptionChange() {
    this.member.description = ($('#memberDescriptionEdit').val() as string);
  }

  applyNameChange() {
    this.member.name = ($('#memberNameEdit').val() as string);      
  }

  clickColor() {
    $(`#colorPicker${this.member.uuid.replace('-','')}`).click();
  }

  colorChanged() {
    if ($(`#colorPicker${this.member.uuid.replace('-','')}`).val() === undefined)
      return;

    this.member.colorCode = ($(`#colorPicker${this.member.uuid.replace('-','')}`).val() as string).split('#')[1];
  }

  editNameWindow() {
    $('#editNameWindow').modal('show');
  }

  editDescriptionWindow() {
    $('#editDescriptionWindow').modal('show');
  }

  deleteMemberWindow() {
    $('#deleteMemberWindow').modal('show');
  }

  deleteSkill(skill: SkillModel) {
    this.member.removeSkill(skill);
  }

  newSkillWindow() {
    (this.$refs.memberSkillAdditor as SkillAdditionModal).show();
  }

  updateSelectedSkills(skillNames: string[]) {
    this.member.skills = this.member.skills.filter(skill => skillNames.includes(skill.name));
    
    skillNames.filter(name => !this.member.skills.map(s => s.name).includes(name))
              .forEach(name => this.member.skills.push(new SkillModel(name, 0)));
  }

  deleteUpcomingSkill(skill: UpcomingSkillModel) {
    this.member.removeUpcomingSkill(skill);
  }

  newUpcomingSkillWindow() {
    (this.$refs.memberUpcomingSkillAdditor as SkillAdditionModal).show();
  }

  updateSelectedUpcomingSkills(skillNames: string[]) {
    skillNames.forEach(name => this.member.upcomingSkills.push(new UpcomingSkillModel(name, 0, new Date())));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  changeSkillDate(skill: UpcomingSkillModel, event: any) {
    const value = event.target.value;
    skill.aquisitionDate = new Date(Date.parse(value + 'T00:00:00'));
    this.member.refreshSkills();
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

.member-header {
    padding: 1em;
}

.member-name:hover {
  cursor: pointer;
}

.sub-header {
  padding: 0.25em;
}

.description-header {
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

.skill-name {
  font-size: 150%;
}

.level-selector {
  margin-left: 1em;
  width: 65px;
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

.acquisition-date {
  margin-top: 0.25em;
}

input[type=date] {
  margin-left: 1em;
  border-color: grey;
}

.upcoming-skill-form {
  width: 15%;
}

.modal-header {
    background-color: rgb(43, 44, 44);
    color: white;
}

.modal-header button {
  color: white;
}

</style>