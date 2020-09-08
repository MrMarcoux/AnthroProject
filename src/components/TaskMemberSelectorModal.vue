<template>
  <div class="task-member-selector-modal cn">    
    <div class="modal fade" id="selectAssigneesWindow" tabindex="-1" role="dialog" aria-labelledby="selectAssigneesWindowCenterTitle" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title"> Select assignees </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close" v-on:click="clear()">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
             <div class="panel-group">
              <div class="panel panel-default">
                <div class="panel-heading d-flex w-100 justify-content-between">
                  <h4 class="panel-title">
                    <span class="clickable" data-toggle="collapse" href="#assignableNow">Members assignable right now </span>                                      
                  </h4>
                  <small> {{ membersAssignableNow().length }} members </small>
                </div>
                <div id="assignableNow" class="panel-collapse collapse">
                  <ul class="list-group">
                    <li class="list-group-item d-flex justify-content-between member-name" v-for="member in membersAssignableNow()" :key="member" v-on:click="toggleSelectedMember(member)">
                      <div> {{ member.name }} </div>
                      <button class="btn check-btn unchecked" :id="`check${member.uuid.replace('-', '')}`"> <font-awesome-icon :icon="['fas', 'check']"/> </button>
                    </li>
                  </ul>
                </div>
              </div>
              <div class="panel panel-default">
                <div class="panel-heading d-flex w-100 justify-content-between">
                  <h4 class="panel-title">
                    <span class="clickable" data-toggle="collapse" href="#assignableFuture">Members assignable before start </span>
                  </h4>                  
                  <small> {{ membersAssignableAfter().length }} members </small>
                </div>
                <div id="assignableFuture" class="panel-collapse collapse">
                  <ul class="list-group">
                    <li class="list-group-item" v-for="member in membersAssignableAfter()" :key="member">
                      <div class="d-flex justify-content-between member-name">
                        <div class="text-left"> {{ member.name }}
                          <br>
                          <small>
                            <b class="collapse-btn" data-toggle="collapse" :href="`#relevantUpcoming${member.uuid.replace('-', '')}`" role="button" aria-expanded="false" :aria-controls="`relevantUpcoming${member.uuid.replace('-', '')}`"> Future skill acquisitions </b>
                            <ul class="collapse" :id="`relevantUpcoming${member.uuid.replace('-', '')}`">
                              <li v-for="skill in task.relevantUpcomingSkills(member)" :key="skill">
                              {{ skill.name }} level {{ skill.level }} on {{ skill.formattedDate() }}
                              </li>
                            </ul>
                          </small>                          
                        </div>
                        <button class="btn check-btn unchecked" :id="`check${member.uuid.replace('-', '')}`"> <font-awesome-icon :icon="['fas', 'check']"/> </button>
                      </div>
                      
                    </li>
                  </ul>
                </div>
              </div>
              <div class="panel panel-default">
                <div class="panel-heading d-flex w-100 justify-content-between">
                  <h4 class="panel-title">
                    <span data-toggle="collapse" class="clickable" href="#assignableNever"> Non-assignable members </span>
                  </h4>
                  <small> {{ membersAssignableNever().length }} members </small>
                </div>
                <div id="assignableNever" class="panel-collapse collapse">
                  <ul class="list-group">
                    <li class="list-group-item" v-for="member in membersAssignableNever()" :key="member"> 
                          <div class="text-left"> {{ member.name }}
                          <br>
                          <small>
                            <b v-show="task.entirelyMissingSkills(member).length > 0" class="collapse-btn" data-toggle="collapse" :href="`#entirelyMissing${member.uuid.replace('-', '')}`" role="button" aria-expanded="false" :aria-controls="`relevantUpcoming${member.uuid.replace('-', '')}`"> Missing skills </b>
                            <ul class="collapse" :id="`entirelyMissing${member.uuid.replace('-', '')}`">
                              <li v-for="skill in task.entirelyMissingSkills(member)" :key="skill">
                              {{ skill.name }} level {{ skill.level }}
                              </li>
                            </ul>
                            <b v-show="task.relevantUpcomingSkills(member).length > 0" class="collapse-btn" data-toggle="collapse" :href="`#missingUpcoming${member.uuid.replace('-', '')}`" role="button" aria-expanded="false" :aria-controls="`relevantUpcoming${member.uuid.replace('-', '')}`"> Skills acquired in the future </b>
                            <ul class="collapse" :id="`missingUpcoming${member.uuid.replace('-', '')}`">
                              <li v-for="skill in task.relevantUpcomingSkills(member)" :key="skill">
                              {{ skill.name }} level {{ skill.level }} on {{ skill.formattedDate()}}
                              </li>
                            </ul>
                            <b v-show="task.insufficientUpcomingSkills(member).length > 0" class="collapse-btn" data-toggle="collapse" :href="`#insufficientUpcoming${member.uuid.replace('-', '')}`" role="button" aria-expanded="false" :aria-controls="`relevantUpcoming${member.uuid.replace('-', '')}`"> Future skills with insufficient levels </b>
                            <ul class="collapse" :id="`insufficientUpcoming${member.uuid.replace('-', '')}`">
                              <li v-for="skill in task.insufficientUpcomingSkills(member)" :key="skill">
                              {{ skill.name }} level {{ skill.level }} on {{ skill.formattedDate() }}
                              </li>
                            </ul>
                            <b v-show="task.insufficientSkills(member).length > 0" class="collapse-btn" data-toggle="collapse" :href="`#insufficientSkills${member.uuid.replace('-', '')}`" role="button" aria-expanded="false" :aria-controls="`insufficientSkills${member.uuid.replace('-', '')}`"> Current skills with insufficient levels </b>
                            <ul class="collapse" :id="`insufficientSkills${member.uuid.replace('-', '')}`">
                              <li v-for="skill in task.insufficientSkills(member)" :key="skill">
                              {{ skill.name }} level {{ skill.level }}
                              </li>
                            </ul>
                          </small>
                        </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
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
import { Task as TaskModel } from '@/models/task';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import $ from 'jquery';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as bootstrap from 'bootstrap';

@Component
export default class TaskMemberSelectorModal extends Vue {

  @Prop({type: Object as () => MemberModel[]})
  public members!: MemberModel[];

  @Prop({type: Object as () => TaskModel})
  public task!: TaskModel;

  selectedMembers: MemberModel[];

  constructor() {
    super();
    this.selectedMembers = this.task.getAssignedMembers();
  }

  clear() {
    this.selectedMembers = [];
  }

  membersAssignableNow(): MemberModel[] {
    return this.members.filter(member => this.task.isMemberQualifed(member));
  }

  membersAssignableAfter(): MemberModel[] {
    return this.members.filter(member => !this.task.isMemberQualifed(member))
                       .filter(member => this.task.isMemberQualifiableBeforeStart(member));    
  }

  updated() {
    for (const member of this.selectedMembers) {
      $(`#check${member.uuid.replace('-', '')}`).removeClass('unchecked');
      $(`#check${member.uuid.replace('-', '')}`).addClass('checked');      
    }    
  }

  membersAssignableNever(): MemberModel[] {
    try {
      return this.members.filter(member => !this.task.isMemberQualifed(member))
                       .filter(member => !this.task.isMemberQualifiableBeforeStart(member));
    } catch(Error) {
      alert(Error);
      return [];
    }
    
  }

  toggleSelectedMember(member: MemberModel) {
    $(`#check${member.uuid.replace('-','')}`).toggleClass('checked');
    $(`#check${member.uuid.replace('-','')}`).toggleClass('unchecked');

    if (this.selectedMembers.includes(member)) {
      this.selectedMembers = this.selectedMembers.filter(mbr => mbr !== member);
    } else {
      this.selectedMembers.push(member);
    }
  }
  
  confirmSelection() {
    this.$emit('members-selected', this.selectedMembers);
    this.clear();
  }

  public show(): void {
    $('#selectAssigneesWindow').modal('show');
  }

  public hide(): void {
    $('#selectAssigneesWindow').modal('hide');
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

.collapse-btn {
    padding: 3px;
    border-color: black;
    background-color:rgb(43, 44, 44);
    color: white;
    border-radius: 3px;
    margin: 2px;
    display: block;
}

.check-btn {
    border-color: black;
    width: 40px;
    height: 40px;
    color: white;
}

.check-btn:hover {
    opacity: 85%;
}

.clickable:hover {
  opacity: 85%;
  cursor: pointer;
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

li {
  color: black;
}



</style>