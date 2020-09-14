import { Member } from './member';
import { Project } from './project';
import { Team } from './team';
import { uuid } from 'uuidv4';
import { Task } from './task';
import { Skill } from './skill';
import { UpcomingSkill } from './upcomingskill';

export class Model {
    projects: Project[];
    teams: Team[];
    members: Member[];
    availableSkills: string[]
    name: string;

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

    public asProjectFile(): string {
        const serializedData = {
            projects: this.projects.map(project => project.asSerializedData()),
            teams: this.teams.map(team => team.asSerializedData()),
            members: this.members.map(member => member.asSerializedData()),
            availableSkills: this.availableSkills
        };

        return JSON.stringify(serializedData);
    }

    public parseData(data: any): void {
        //First, flat deserialization
        //Link teams to projects
        //Link predecessors and successors
        this.availableSkills = data.availableSkills;
        
        for (const memberData of data.members) {
            this.members.push(Member.fromUnparsedData(memberData));
        }

        for (const teamData of data.teams) {
            this.teams.push(Team.fromUnparsedData(this.members, teamData));
        }

        for (const projectData of data.projects) {
            this.projects.push(Project.fromUnparsedData(this.members, this.teams, projectData));
        }
    }

    public static fromProjectFile(file: any): Model {
        //TODO: Handle serialization here

        //First, flat deserialization
        //Link teams to projects
        //Then, link members to teams
        //Link predecessors and successors

        const reader = new FileReader();
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 5);
        const farFutureDate = new Date();
        farFutureDate.setDate(farFutureDate.getDate() + 5);

        const model = new Model();

        reader.onload = function(event) {
            const data = JSON.parse(event.target?.result as string);
            model.parseData(data);
        }

        reader.readAsText(file);

        model.name = file.name;

        //TODO: Replace dummy values with real deserialized values    
/*        const tasks = [new Task(uuid(), 'task 1', 'write me', new Date(), new Date(), 5),
                       new Task(uuid(), 'task 2', 'write me', new Date(), new Date(), 5),
                       new Task(uuid(), 'task 3', 'write me', new Date(), new Date(), 5)];

        tasks[0].subTasks = [new Task(uuid(), 'task 4', 'write me', futureDate, farFutureDate, 5),
                          new Task(uuid(), 'task 5', 'write me', new Date(), futureDate, 5),
                          new Task(uuid(), 'task 6', 'write me', new Date(), futureDate, 5)];

        tasks[0].requiredSkills.push(new Skill('C++', 5));
        tasks[0].requiredSkills.push(new Skill('C#', 5));
        tasks[0].requiredSkills.push(new Skill('Assembly', 5));
        tasks[0].requiredSkills.push(new Skill('Rust', 5));
        
        tasks[0].completed = true;
        model.teams = [new Team(uuid(), 'team 1', 'FF80F9', 'Lorem ipsum dolor sit amet'),
                       new Team(uuid(), 'team 2', '0080F9', 'Lorem ipsum dolor sit amet'),
                       new Team(uuid(), 'team 3', 'F080F9', 'Lorem ipsum dolor sit amet')];
        
        model.members = [new Member(uuid(), 'Do', 'woops', '000000', 5,5,[],[]),
                        new Member(uuid(), 'Re', 'woops', '000000', 5,5,[],[]),
                        new Member(uuid(), 'Mi', 'woops', '000000', 5,5,[],[])];
        
        model.teams[0].members = model.members;

        //Member with all the skills to do the first task
        model.members[0].skills.push(new Skill('C++', 5));
        model.members[0].skills.push(new Skill('C#', 5));
        model.members[0].skills.push(new Skill('Assembly', 5));
        model.members[0].skills.push(new Skill('Rust', 5));


        //Member with only upcoming skills
        model.members[1].upcomingSkills.push(new UpcomingSkill('C++', 5, futureDate));
        model.members[1].upcomingSkills.push(new UpcomingSkill('C#', 5, futureDate));
        model.members[1].upcomingSkills.push(new UpcomingSkill('Assembly', 5, futureDate));
        model.members[1].upcomingSkills.push(new UpcomingSkill('Rust', 5, futureDate));

        //Member with missing and upcoming skills
        model.members[2].upcomingSkills.push(new UpcomingSkill('C#', 5, futureDate));
        model.members[2].upcomingSkills.push(new UpcomingSkill('Assembly', 4, futureDate));
        model.members[2].skills.push(new Skill('Rust', 4));

        model.availableSkills = ["C++", "C#", "Rust", "Assembly"];
        const project = new Project(uuid(), 'project 1', ' Lorem ipsum dolor sit amet', '000000');
        project.addTasks(tasks);
        project.outsiders = model.members;
        model.projects.push(project);
        model.projects.push(new Project(uuid(), 'project 2', ' Lorem ipsum dolor sit amet', 'FF00FF'));
        model.projects.push(new Project(uuid(), 'project 3', ' oof', '00FFFF'));*/
        return model;
    }

    public deleteSkill(name: string) {                
        if (!this.availableSkills.includes(name)) {
            return;
        }

        this.availableSkills = this.availableSkills.filter(skillName => skillName !== name);
        this.members.forEach(member => member.removeSkillFromName(name));

        for (const project of this.projects) {
            project.tasks.forEach(task => task.removeSkillFromName(name));
        }       
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

        this.projects.flatMap(project => project.tasks)
                     .forEach(task => task.renameSkill(oldName, newName));
    }

    removeMember(member: Member) {
        for (const project of this.projects) {
            project.tasks.forEach(task => task.removeMember(member));
        }

        this.teams.forEach(team => team.removeMember(member));

        this.members = this.members.filter(m => m !== member);
    }

    removeMembers(members: Member[]) {
        members.forEach(member => this.removeMember(member));
    }

    removeTeam(team: Team) {
        for (const project of this.projects) {
            if (project.team === team) {
                project.team = team;
            }
        }

        this.teams = this.teams.filter(t => t !== team);
    }
}