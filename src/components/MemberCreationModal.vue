<template>
  <div class="member-creation-modal cn">    
    <div class="modal fade" id="memberCreationWindow" tabindex="-1" role="dialog" aria-labelledby="memberCreationWindowCenterTitle" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title"> New member </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body text-left">
            <h5 class="edit-label"> Title </h5>
            <input type="text" class="form-control" id="memberName" placeholder="Enter member name" />
            <br/>
            <h5 class="edit-label"> Description </h5>
            <textarea class="form-control" id="memberDescription" placeholder="Enter member description" />
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal"> Dismiss </button>
            <button type="button" class="btn btn-info" v-on:click="memberCreated()" data-dismiss="modal"> Confirm </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Member as MemberModel } from '@/models/member';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import $ from 'jquery';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as bootstrap from 'bootstrap';
import { uuid } from 'uuidv4';

@Component
export default class MemberCreationModal extends Vue {

  constructor() {
    super();
  }

  memberCreated() {
    const name = $('#memberName').val() as string;
    
    const description = $('#memberDescription').val() as string;    

    this.$emit('member-created', new MemberModel(uuid(), name, description, 'FFFFFF', 0 , 0 , [], []));
  }

  public show(): void {
    $('#memberName').val("");
    $('#memberDescription').val("");
    $('#memberCreationWindow').modal('show');
  }

  public hide(): void {
    $('#memberCreationWindow').modal('hide');
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