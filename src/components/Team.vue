<template>
  <div class="team cn">
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
          <a class="nav-link active" v-on:click="switchView('team')" id="teamTab" href="#">Member</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" v-on:click="switchView('members')" id="membersTab" href="#">Members</a>
        </li>
      </ul>
      <div v-show="activeSection == 'team'">
        <div class="team-header d-flex w-100 justify-content-between">
          <div class="d-flex">
            <span class="color-picker-wrap" :id="`colorPickerPlaceholder`" :style="`background-color: #${team.colorCode}`" v-on:click="clickColor()"></span>
            <input type="color" :id="`colorPicker${this.team.uuid.replace('-','')}`">
            <h1 v-on:click="editNameWindow()" class="display-3 text-left team-name" title="Edit name"> 
              {{ team.name }}
            </h1>
          </div>
          <div>
            <font-awesome-icon class="edit-name-icon" title="Edit name" v-on:click="editNameWindow()" :icon="['fas', 'pen']" />
            <font-awesome-icon class="delete-icon" title="Delete this team" v-on:click="deleteTeamWindow()" :icon="['fas', 'trash']" />
          </div>
        </div>
        <hr/>
        <h2 class="description-header text-left" v-on:click="editDescriptionWindow()"> Description </h2>
        <div class="description-body d-flex w-100 justify-content-between" v-on:click="editDescriptionWindow()">
          <p class="text-left" style="white-space: pre-line"> {{ team.description }} </p>
          <font-awesome-icon class="edit-desc-icon" title="Edit team description" :icon="['fas', 'pen']" />
        </div>
        
      </div>
      <div v-show="activeSection == 'members'">
        <br>
        <ul class="list-group list-group-flush">
          <li class="list-group-item" v-for="member in this.team.members" :key="member">
            <div class="d-flex justify-content-between">
              <span class="member-name" v-bind:to="'/members/' + member.uuid">  {{ member.name }} </span>
              <font-awesome-icon class="delete-icon icon" title="Remove this member" v-on:click="deleteMember(member)" :icon="['fas', 'trash']" />
            </div>
          </li>
        </ul>
        <button type="button" class="btn btn-info btn-lg" v-on:click="newMemberWindow()">
          <span>
            <b>+</b>
            <span class="hidden-btn-message"> Add a new member </span>
          </span>
        </button>
        <MemberSelectorModal ref="teamMemberSelector" :members="selectableMembers()" v-on:members-selected="addMembers($event)"/>
      </div>
    </div>

    <div class="modal fade" id="editTeamNameWindow" tabindex="-1" role="dialog" aria-labelledby="editTeamNameWindowCenterTitle" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title"> Edit team name </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <input type="text" class="form-control" id="teamNameEdit" placeholder="Enter team name" :value="team.name">
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Dismiss</button>
            <button type="button" class="btn btn-info" data-dismiss="modal" v-on:click="applyNameChange()"> Save changes </button>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="editTeamDescriptionWindow" tabindex="-1" role="dialog" aria-labelledby="editTeamDescriptionWindowCenterTitle" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title"> Edit team description </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <textarea class="form-control" id="teamDescriptionEdit" placeholder="Enter team description" :value="team.description" />
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Dismiss</button>
            <button type="button" class="btn btn-info" data-dismiss="modal" v-on:click="applyDescriptionChange()"> Save changes </button>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="deleteTeamWindow" tabindex="-1" role="dialog" aria-labelledby="deleteTeamWindowCenterTitle" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title"> Are you sure you want to delete this team? </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">No</button>
            <button type="button" class="btn btn-danger" data-dismiss="modal" v-on:click="deleteTeam()"> Delete </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Member as MemberModel } from '@/models/member';
import { Team as TeamModel } from '@/models/team';
import MemberSelectorModal from '@/components/MemberSelectorModal.vue';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import $ from 'jquery';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as bootstrap from 'bootstrap';
import TeamSelectorModal from './TeamSelectorModal.vue';

@Component({
  components: {
    MemberSelectorModal
  }
})
export default class Team extends Vue {
  readonly sections = ['team', 'members'];
  activeSection: string;
  team: TeamModel;

  constructor() {
    super();
    this.activeSection = this.sections[0];
    this.team = this.$store.state.model.teams.find((team: TeamModel) => team.uuid === this.$route.params.uuid);    
}

  mounted() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const comp = this;
    $(document).on('change', `#colorPicker${this.team.uuid.replace('-','')}`, function() {
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

  deleteTeam() {
    this.$store.state.model.removeTeam(this.team);
    this.$router.push('/');
  }

  applyDescriptionChange() {
    this.team.description = ($('#teamDescriptionEdit').val() as string);
  }

  applyNameChange() {
    this.team.name = ($('#teamNameEdit').val() as string);      
  }

  clickColor() {
    $(`#colorPicker${this.team.uuid.replace('-','')}`).click();
  }

  colorChanged() {
    if ($(`#colorPicker${this.team.uuid.replace('-','')}`).val() === undefined)
      return;

    this.team.colorCode = ($(`#colorPicker${this.team.uuid.replace('-','')}`).val() as string).split('#')[1];
  }

  editNameWindow() {
    $('#editTeamNameWindow').modal('show');
  }

  editDescriptionWindow() {
    $('#editTeamDescriptionWindow').modal('show');
  }

  deleteTeamWindow() {
    $('#deleteTeamWindow').modal('show');
  }

  deleteMember(member: MemberModel) {
    this.team.members = this.team.members.filter(m => m !== member);
  }

  newMemberWindow() {
    (this.$refs.teamMemberSelector as TeamSelectorModal).show();
  }

  selectableMembers(): MemberModel[] {
    return this.$store.state.model.members.filter((member: MemberModel) => !this.team.members.includes(member));
  }

  addMembers(members: MemberModel[]) {
    for (const member of members) {
      this.team.members.push(member);      
    }
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

.team-header {
    padding: 1em;
}

.team-name:hover {
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

.modal-header {
  background-color: rgb(43, 44, 44);
  color: white;
}

.modal-header button {
  color: white;
}

</style>