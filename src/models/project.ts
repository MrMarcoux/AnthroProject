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

    public hasTeam(): boolean {
        return this.team !== null && this.team !== undefined;
    }

    public clearTeam() {
        if (!this.hasTeam()) {
            return;
        }

        this.tasks.forEach(task => task.removeTeamMembers(this.team as Team));
        this.team = undefined;
    }

    public removeOutsider(member: Member) {
        this.outsiders = this.outsiders.filter(outsider => outsider !== member);

        if (this.team?.members.includes(member)) {
            return;
        }

        this.tasks.forEach(task => task.removeMember(member));
    }

    public removeTask(task: Task) {
        const flatList = task.toFlatList();
        
        for (const rootTask of this.tasks) {
            rootTask.removePredecessorsRecursively(flatList);
        }

        this.tasks = this.tasks.filter(t => t !== task);
        
        for (const rootTask of this.tasks) {            
            rootTask.removeSubtask(task);
        }
    }

    public asSerializedData(): any {
        return {
            uuid: this.uuid,
            name: this.name,
            description: this.description,
            colorCode: this.colorCode,
            team: this.team ? this.team.uuid : undefined,
            outsiders: this.outsiders.map(outsider => outsider.uuid),
            tasks: this.tasks.map(task => task.asSerializedData())
        };
    }

    public static fromUnparsedData(availableMembers: Member[], availableTeams: Team[], data: any): Project {
        const project = new Project(data.uuid, data.name, data.description, data.colorCode);
        
        project.team = availableTeams.find(t => t.uuid === data.team);
        
        project.outsiders = availableMembers.filter(m => data.outsiders.includes(m.uuid));

        for (const taskData of data.tasks) {
            project.tasks.push(Task.fromUnparsedData(project, availableMembers, taskData))
        }

        for (const taskData of data.tasks) {
            const task = project.tasks.find(t => t.uuid === taskData.uuid);
            const availableTasks = task?.toFlatList();
            task?.parseLocusesFromData(availableTasks ? availableTasks : [], taskData);
        }

        return project;
    }

}