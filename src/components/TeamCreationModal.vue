<template>
  <div class="team-creation-modal cn">    
    <div class="modal fade" id="teamCreationWindow" tabindex="-1" role="dialog" aria-labelledby="teamCreationWindowCenterTitle" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title"> New team </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body text-left">
            <h5 class="edit-label"> Title </h5>
            <input type="text" class="form-control" id="teamName" placeholder="Enter team name" />
            <br/>
            <h5 class="edit-label"> Description </h5>
            <textarea class="form-control" id="teamDescription" placeholder="Enter team description" />
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal"> Dismiss </button>
            <button type="button" class="btn btn-info" v-on:click="teamCreated()" data-dismiss="modal"> Confirm </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Team as TeamModel } from '@/models/team';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import $ from 'jquery';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as bootstrap from 'bootstrap';
import { uuid } from 'uuidv4';

@Component
export default class TeamCreationModal extends Vue {

  constructor() {
    super();
  }

  teamCreated() {
    const name = $('#teamName').val() as string;
    const description = $('#teamDescription').val() as string;    

    this.$emit('team-created', new TeamModel(uuid(), name, 'FFFFFF', description));
  }

  public show(): void {
    $('#teamName').val("");
    $('#teamDescription').val("");
    $('#teamCreationWindow').modal('show');
  }

  public hide(): void {
    $('#teamCreationWindow').modal('hide');
  }
}
</script>

<style scoped>
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
    width: 40px;
    color: white;
}

.check-btn:hover {
    opacity: 85%;
}


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

.edit-label {  
  color: black;
}

</style>