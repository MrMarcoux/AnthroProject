import { Member } from './member';
import { Project } from './project';
import { Team } from './team';
import { uuid } from 'uuidv4';
import { Task } from './task';
import { readyException } from 'jquery';

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
        model.teams = [new Team(uuid(), 'team 1', 'FF80F9', 'Lorem ipsum dolor sit amet'),
                       new Team(uuid(), 'team 2', '0080F9', 'Lorem ipsum dolor sit amet'),
                       new Team(uuid(), 'team 3', 'F080F9', 'Lorem ipsum dolor sit amet')];
        
        model.members = [new Member(uuid(), 'Do', 'woops', '000000', 5,5,[],[]),
                        new Member(uuid(), 'Re', 'woops', '000000', 5,5,[],[]),
                        new Member(uuid(), 'Mi', 'woops', '000000', 5,5,[],[])];
        model.availableSkills = ["C++", "C#", "Rust", "Assembly"];
        const project = new Project(uuid(), 'project 1', ' Lorem ipsum dolor sit amet', '000000'); 
        project.addTasks(tasks);                       
        model.projects.push(project);
        model.projects.push(new Project(uuid(), 'project 2', ' Lorem ipsum dolor sit amet', 'FF00FF'));
        model.projects.push(new Project(uuid(), 'project 3', ' oof', '00FFFF'));
        return model;
    }

    public deleteSkill(name: string) {                
        if (!this.availableSkills.includes(name)) {
            return;
        }

        this.availableSkills = this.availableSkills.filter(skillName => skillName !== name);
        this.members.forEach(member => member.removeSkill(name));
        //TODO: Clear the skill from all tasks
        //this.projects.flatMap(project => project.tasks).removeSkill(name);
    }
    
    public deleteSkills(names: string[]) {
        this.availableSkills = this.availableSkills.filter(skillName => !names.includes(skillName));
    }

    public addSkill(skillName: string) {
        if (skillName == null || skillName == "") {
            throw new Error('Skill name cannot be null or empty.');
        }

        if (!this.availableSkills.includes(skillName)) {
            this.availableSkills.push(skillName);
        } else {
            throw new Error(`Name ${skillName} is already taken`);
        }
    }

    public addSkills(skillNames: string[]) {
        skillNames.forEach(name => this.addSkill(name));
    }

    public modifySkillName(oldName: string, newName: string) {
        if (newName == "" || newName == null) {
            throw new Error('Skill name cannot be empty');
        }

        const existingIndex = this.availableSkills.indexOf(newName);

        if (existingIndex != -1) {
            throw new Error(`The skill name ${newName} already exists.`);
        }

        const oldIndex = this.availableSkills.indexOf(oldName);
        
        this.availableSkills.splice(oldIndex, 1);
        this.availableSkills.splice(oldIndex, 0, newName);

        this.members.forEach(member => member.renameSkill(oldName, newName));

        //TODO: Find and replace in every tasks
        //this.projects.flatMap(project => project.tasks).renameSkill(oldName, newName);
    }
}