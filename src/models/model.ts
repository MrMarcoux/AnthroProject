import { Member } from './member';
import { Project } from './project';
import { Team } from './team';

export class Model {
    projects: Project[];
    teams: Team[];
    members: Member[];
    availableSkills: string[]

    constructor() {
        this.projects = [];
        this.teams = [];
        this.members = [];
        this.availableSkills = [];
    }

    public asProjectFile() : any {
        //TODO: Handle serialization here
        return {};
    }

    public static fromProjectFile(file: any): Model {
        //TODO: Handle serialization here
        return new Model();
    }

    public deleteSkill(name: string) {
        this.availableSkills = this.availableSkills.filter(skillName => skillName !== name);
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