<template>
  <div class="task-creation-modal cn">    
    <div class="modal fade" id="taskCreationWindow" tabindex="-1" role="dialog" aria-labelledby="taskCreationWindowCenterTitle" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title"> New task </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body text-left">
            <h5 class="task-edit-label"> Title </h5>
            <input type="text" class="form-control" id="taskName" placeholder="Enter task name" />
            <br/>
            <h5 class="task-edit-label"> Description </h5>
            <textarea class="form-control" id="taskDescription" placeholder="Enter task description" />
            <br/>
            <h5 class="task-edit-label"> Start date </h5>
            <input type="date" id="startDate" :value="this.formattedCurrentDate()" />
            <br/>
            <br/>
            <h5 class="task-edit-label"> End date </h5>
            <input type="date" id="endDate" :value="this.formattedCurrentDate()" />
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal"> Dismiss </button>
            <button type="button" class="btn btn-info" v-on:click="taskCreated()" data-dismiss="modal"> Confirm </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Task as TaskModel } from '@/models/task';
import { DateFormatter } from '@/models/DateFormatter';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import $ from 'jquery';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as bootstrap from 'bootstrap';
import { uuid } from 'uuidv4';

@Component
export default class TaskCreationModal extends Vue {
  /*@Prop({type: Object as () => string})
  public parent!: TaskModel;

  @Prop({type: Object as () => string})
  public project!: ProjectModel;*/


  constructor() {
    super();
  }

  taskCreated() {
    const name = $('#taskName').val() as string;
    
    const description = $('#taskDescription').val() as string;
    
    const endDate = new Date(Date.parse($('#endDate').val() as string) + 1);
    endDate.setDate(endDate.getDate() + 1);
        
    const startDate = new Date(Date.parse($('#endDate').val() as string) + 1);
    startDate.setDate(startDate.getDate() + 1);

    this.$emit('task-created', new TaskModel(uuid(), name, description, startDate, endDate, 0, undefined));
  }

  formattedCurrentDate(): string {
    return DateFormatter.formatDateForDisplay(new Date());
  }

  public show(): void {
    $('#taskCreationWindow').modal('show');
  }

  public hide(): void {
    $('#taskCreationWindow').modal('hide');
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

.task-edit-label {  
  color: black;
}

</style>