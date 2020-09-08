<template>
<div class="skill-addition-modal cn">
    <div class="modal fade" :id="`selectSkillsWindow${modalId.replace('-','')}`" tabindex="-1" role="dialog" :aria-labelledby="`selectSkillsWindow${modalId.replace('-','')}CenterTitle`" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header panel-heading">
            <h5 class="modal-title"> Select skills </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div v-show="this.$store.state.model.availableSkills.length === 0">
                No skills are available for selection
            </div>
            <ul class="list-group list-group-flush">
                <li class="list-group-item d-flex justify-content-between member-name" v-for="skillName in this.$store.state.model.availableSkills" :key="skillName">
                    <div> {{ skillName }} </div>
                    <button :class="`btn check-btn check${sanitizeId(skillName)}`" v-on:click="toggleSelectedSkill(skillName)"> 
                      <font-awesome-icon :icon="['fas', 'check']"/>
                    </button>
                </li>
            </ul>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal"> Dismiss </button>
            <button type="button" class="btn btn-info" v-on:click="confirmSelection()" data-dismiss="modal"> Confirm </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import $ from 'jquery';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as bootstrap from 'bootstrap';
import { uuid } from 'uuidv4';

@Component
export default class SkillAdditionModal extends Vue {
  selectedSkills: string[];

  @Prop({type: Object as () => string[]})
  public preselected!: string[];

  modalId: string;

  constructor() {
    super();
    this.selectedSkills = [];
    this.modalId = uuid();
  }

  updated() {
    this.selectedSkills = this.preselected;
  }
  
  confirmSelection() {
    this.$emit('skills-selected', this.selectedSkills);
    this.clear();
  }
  
  toggleSelectedSkill(skillName: string) {
    $(`#selectSkillsWindow${this.modalId.replace('-','')} .check${this.sanitizeId(skillName)}`).toggleClass('checked');
    $(`#selectSkillsWindow${this.modalId.replace('-','')} .check${this.sanitizeId(skillName)}`).toggleClass('unchecked');
    
    if (this.selectedSkills.includes(skillName)) {
      this.selectedSkills = this.selectedSkills.filter(name => name !== skillName);
    } else {
      this.selectedSkills.push(skillName);
    }
  }

  sanitizeId(unsanitized: string): string {
    return unsanitized.replaceAll('#', 'sharp').replaceAll('+', 'plus');
  }

  clear() {
      this.selectedSkills = [];
  }

  public show(): void {
    this.selectedSkills = this.preselected;
    $(`#selectSkillsWindow${this.modalId.replace('-','')} .check-btn`).removeClass('checked');
    $(`#selectSkillsWindow${this.modalId.replace('-','')} .check-btn`).addClass('unchecked');

    for (const skillName of this.selectedSkills) {
      $(`#selectSkillsWindow${this.modalId.replace('-','')} .check${this.sanitizeId(skillName)}`).addClass('checked');
      $(`#selectSkillsWindow${this.modalId.replace('-','')} .check${this.sanitizeId(skillName)}`).removeClass('unchecked');
    }

    $(`#selectSkillsWindow${this.modalId.replace('-','')}`).modal('show');
  }

  public hide(): void {
    $(`#selectSkillsWindow${this.modalId.replace('-','')}`).modal('hide');
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