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

    public addTasks(tasks: Task[]) {
        tasks.forEach(task => this.addTask(task));
    }

    public doneTasks(): Task[] {
        return this.tasks.filter(task => task.completed);
    }

    public leftTasks(): Task[] {
        return this.tasks.filter(task => !task.completed);
    }

    public completionRatio(): number {
        if (this.leftTasks().length == 0) {
            return 1;
        }

        return parseFloat((this.doneTasks().length/this.tasks.length).toFixed(2));
    }
}