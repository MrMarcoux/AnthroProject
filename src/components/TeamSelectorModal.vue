<template>
  <div class="team-selector-modal cn">    
    <div class="modal fade" id="editTeamWindow" tabindex="-1" role="dialog" aria-labelledby="editTeamWindowCenterTitle" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title"> Change assigned team </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <h4> Currently assigned team: {{ teamName }} </h4>
            <ul class="list-group list-group-flush">
                <li class="list-group-item d-flex justify-content-between team-name" data-dismiss="modal" v-for="team in this.$store.state.model.teams" :key="team" v-on:click="changeProjectTeam(team)">
                    <div> {{ team.name }} </div>
                </li>
            </ul>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Dismiss</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { Project as  ProjectModel} from '../models/project';
import { Team as  TeamModel} from '../models/team';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import $ from 'jquery';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as bootstrap from 'bootstrap';

@Component
export default class TeamSelectorModal extends Vue {
  @Prop({type: Object as () => string})
  public projectUuid!: string;
  project: ProjectModel;
  teamName = "None";

  constructor() {
    super();
    this.project = this.$store.state.model.projects.find((proj: ProjectModel) => proj.uuid === this.projectUuid);    
  }

  changeProjectTeam(team: TeamModel) {
    this.project.clearTeam();
    this.project.team = team;
    this.teamName = team.name;

    this.$emit('team-selected', team);
  }
  
  public show(): void {
    $('#editTeamWindow').modal('show');
  }

  public hide(): void {
    $('#editTeamWindow').modal('hide');
  }

}
</script>

<style scoped>

.team-name {
    transition: 0.3s;
    border-left-width: 1em;
    border-left-color: white;
}

.team-name:hover {
  padding: 1em;
  font-size: 125%;
  cursor: pointer;
}

</style>