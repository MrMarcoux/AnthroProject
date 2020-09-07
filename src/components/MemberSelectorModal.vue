<template>
  <div class="member-selector-modal cn">    
    <div class="modal fade" id="selectMembersWindow" tabindex="-1" role="dialog" aria-labelledby="selectMembersWindowCenterTitle" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title"> Select members </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close" v-on:click="clear()">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div v-show="members.length === 0">
                No individuals are available for selection
            </div>
            <ul class="list-group list-group-flush">
                <li class="list-group-item d-flex justify-content-between member-name" v-for="member in members" :key="member" v-on:click="toggleSelectedMember(member)">
                    <div> {{ member.name }} </div>
                    <button class="btn check-btn unchecked" :id="`check${member.name.replace(/ /g,'')}`"> <font-awesome-icon :icon="['fas', 'check']"/> </button>
                </li>
            </ul>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal" v-on:click="clear()"> Dismiss </button>
            <button type="button" class="btn btn-info" v-on:click="confirmSelection()" data-dismiss="modal"> Confirm </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { Member as MemberModel } from '@/models/member';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import $ from 'jquery';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as bootstrap from 'bootstrap';

@Component
export default class MemberSelectorModal extends Vue {
  @Prop({type: Object as () => MemberModel[]})
  public members!: MemberModel[];
  selectedMembers: MemberModel[];

  constructor() {
    super();
    this.selectedMembers = [];
  }

  confirmSelection() {
    this.$emit('members-selected', this.selectedMembers);
    this.clear();
  }

  toggleSelectedMember(member: MemberModel) {
    $(`#check${member.name.replace(/ /g,'')}`).toggleClass('checked');
    $(`#check${member.name.replace(/ /g,'')}`).toggleClass('unchecked');

    if (this.selectedMembers.includes(member)) {
      this.selectedMembers = this.selectedMembers.filter(mbr => mbr !== member);
    } else {
      this.selectedMembers.push(member);
    }
  }

  clear() {
      this.selectedMembers = [];
  }

  public show(): void {
    $('#selectMembersWindow').modal('show');
  }

  public hide(): void {
    $('#selectMembersWindow').modal('hide');
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

</style>