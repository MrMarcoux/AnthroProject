<template>
  <div class="project-gantt-view cn">
    <div id="ganttDiagram" class="diagram-container"></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { Project as ProjectModel } from '@/models/project';
import { Task as TaskModel } from '@/models/task';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import $ from 'jquery';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as bootstrap from 'bootstrap';
import 'simple-gantt-chart/dist/index.css';
import { GanttChart, taskType } from 'simple-gantt-chart';

class GanttableTask {
  model: TaskModel;
  indentLevel: number;
  dependencies: number[];
  graphicalId: number;

  constructor(model: TaskModel, indentLevel: number) {
    this.model = model;
    this.indentLevel = indentLevel;
    this.dependencies = [];
    this.graphicalId = 0;
  }

  toGanttObject(): taskType {
    const diffTime = Math.abs(+this.model.end - +this.model.start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));     

    return {
      id: this.graphicalId,
      text: `${this.model.name}`,
      startDate: this.model.start,
      days: diffDays < 1 ? 1 : diffDays,
      dependencies: this.dependencies
    }
  }
}

@Component
export default class ProjectGanttView extends Vue {
  
  @Prop({type: Object as () => ProjectModel})
  public project!: ProjectModel;
  gantt: GanttChart;
  interval: number;
  
  constructor() {
    super();

    this.gantt = new GanttChart();

    //This approach might be a bit ham-fisted, but the lifecycle hooks seemed to be insufficient
    this.interval = setInterval(this.refreshGantt, 1000);    
  }
  
  refreshGantt() {
    const flatTaskMap = this.project.tasks.flatMap(t => this.getFlatTasksArray([], 0, t));
    const uuidsArray = flatTaskMap.map(t => t.model.uuid);
    flatTaskMap.forEach(t => this.bindGraphicalIds(uuidsArray, t));

    this.gantt.setData(flatTaskMap.map(t => t.toGanttObject()));
    const elem = document.getElementById('ganttDiagram');

    if (elem !== null) {
      elem.innerHTML = "";
      this.gantt.render(elem);
      $('.gc_tree_table_cell[data-columnid="text"]').each(function(index) {
          if(flatTaskMap[index] !== undefined) {
            $(this).attr({"style" : $(this).attr("style")+`text-indent: ${flatTaskMap[index].indentLevel*40}px;`}); 
          }          
      });
    }

    clearInterval(this.interval);
  }

  updated() {
    this.refreshGantt();
  }
 
  getFlatTasksArray(initialArray: GanttableTask[], indentLevel: number, task: TaskModel): GanttableTask[] {
    if (!initialArray.some(t => t.model === task)) {
      initialArray.push(new GanttableTask(task, indentLevel));
    }
      
    task.subTasks.flatMap(t => this.getFlatTasksArray(initialArray, indentLevel+1, t));

    return initialArray;
  }


  bindGraphicalIds(uuids: string[], task: GanttableTask) {
    for (const predecessor of task.model.predecessors) {
        task.dependencies.push(uuids.indexOf(predecessor.uuid) + 1);
    }

    task.graphicalId = uuids.indexOf(task.model.uuid) + 1; 
  }

}
</script>

<style scoped>

.diagram-container {
    position: absolute;
    top: 100px;
    width: 100%;
    height: 90%;
}

</style>