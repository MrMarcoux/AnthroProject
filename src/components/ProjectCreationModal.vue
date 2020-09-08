<template>
  <div class="project-creation-modal cn">    
    <div class="modal fade" id="projectCreationWindow" tabindex="-1" role="dialog" aria-labelledby="projectCreationWindowCenterTitle" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title"> New project </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body text-left">
            <h5 class="edit-label"> Title </h5>
            <input type="text" class="form-control" id="projectName" placeholder="Enter project name" />
            <br/>
            <h5 class="edit-label"> Description </h5>
            <textarea class="form-control" id="projectDescription" placeholder="Enter project description" />
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal"> Dismiss </button>
            <button type="button" class="btn btn-info" v-on:click="projectCreated()" data-dismiss="modal"> Confirm </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Project as ProjectModel } from '@/models/project';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import $ from 'jquery';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as bootstrap from 'bootstrap';
import { uuid } from 'uuidv4';

@Component
export default class ProjectCreationModal extends Vue {

  constructor() {
    super();
  }

  projectCreated() {
    const name = $('#projectName').val() as string;
    
    const description = $('#projectDescription').val() as string;    

    this.$emit('project-created', new ProjectModel(uuid(), name, description, 'FFFFFF'));
  }

  public show(): void {
    $('#projectName').val("");
    $('#projectDescription').val("");
    $('#projectCreationWindow').modal('show');
  }

  public hide(): void {
    $('#projectCreationWindow').modal('hide');
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