import { Member } from './member';
import { Project } from './project';
import { Team } from './team';
import { uuid } from 'uuidv4';
import { Task } from './task';

export class Model {
    projects: Project[];
    teams: Team[];
    members: Member[];
    availableSkills: string[]
    private name: string;

    constructor() {
        this.projects = [];
        this.teams = [];
        this.members = [];
        this.availableSkills = [];
        this.name = "";
    }

    public getName(): string {
        return this.name.split('.')[0];
    }

    public asProjectFile(): any {
        //TODO: Handle serialization here
        return {};
    }

    public static fromProjectFile(file: any): Model {
        //TODO: Handle serialization here
        const model = new Model();
        model.name = file.name;
        //TODO: Replace dummy value with real deserialized values

        const tasks = [new Task('task 1', 'write me', new Date(), new Date(), 5),
                       new Task('task 2', 'write me', new Date(), new Date(), 5),
                       new Task('task 3', 'write me', new Date(), new Date(), 5)];
        tasks[0].completed = true;
        const project = new Project(uuid(), 'project 1', ' woop woop beep beep', '000000'); 
        project.addTasks(tasks);                       
        model.projects.push(project);
        model.projects.push(new Project(uuid(), 'project 2', ' hey no stop it please', 'FF00FF'));
        model.projects.push(new Project(uuid(), 'project 3', ' oof', '00FFFF'));        
        return model;
    }

    public deleteSkill(name: string) {        
        //TODO: Clear the skill from all tasks        
        if (!this.availableSkills.includes(name)) {
            return;
        }

        this.availableSkills = this.availableSkills.filter(skillName => skillName !== name);
        this.members.forEach(member => member.removeSkill(name));
        //this.projects.flatMap(project => project.tasks).removeSkill(name);
    }
    
    public deleteSkills(names: string[]) {
        this.availableSkills = this.availableSkills.filter(skillName => !names.includes(skillName));
    }

    public addSkill(skillName: string) {
        if (!this.availableSkills.includes(skillName)) {
            this.availableSkills.push(skillName);
        }
    }

    public addSkills(skillNames: string[]) {
        skillNames.forEach(name => this.addSkill(name));
    }
}