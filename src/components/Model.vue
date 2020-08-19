<template>
  <div class="model cn">
    <div class="inner">
      <h2> {{ this.$store.state.model.getName() }} </h2>
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
          <a class="nav-link" v-on:click="switchView('availableSkills')" id="availableSkillsTab" style="color: inherit;">Available skills</a>
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
      </div>
      <div v-show="activeSection == 'teams'">
          content
      </div>
      <div v-show="activeSection == 'members'">
          meme
      </div>
      <div v-show="activeSection == 'availableSkills'">
          content
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Initialization extends Vue {

  readonly sections = ['projects', 'teams', 'members', 'availableSkills'];
  activeSection: string;

  constructor() {
    super();
    this.activeSection = this.sections[0];
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

</style>
