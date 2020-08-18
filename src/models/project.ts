import { Task } from './task';
import { Team } from './team';
import { Member } from './member';

export class Project {
    readonly uuid: string;
    name: string;
    description: string;
    colorCode: string;

    tasks: Task[];
    team?: Team;
    outsiders: Member[];

    constructor(uuid: string, name: string, description: string, colorCode: string) {
        this.uuid = uuid;
        this.name = name;
        this.description = description;
        this.colorCode = colorCode;
        this.tasks = [];
        this.outsiders = []; 
    }

    public addTask(task: Task) {
        if (!this.tasks.includes(task)) {
            task.project = this;
            this.tasks.push(task);
        }
    }
}