import { Project } from './project';
import { Task } from './task';
import { UpcomingSkill } from './upcomingskill';
import { Skill } from './skill';
import { Team } from './team';

export class Member {
    readonly uuid: string;
    name: string;
    description: string;
    colorCode: string;
    availableWeeklyHours: number;
    availableDailyHours: number;
    tasks: Task[]; //TODO: Remove
    teams: Team[]; //TODO: Remove
    skills: Skill[]; 
    upcomingSkills: UpcomingSkill[];

    constructor(uuid: string, name: string, description: string, colorCode: string, 
                availableWeeklyHours: number, availableDailyHours: number,
                skills: Skill[], upcomingSkills: UpcomingSkill[]) {
        this.uuid = uuid;
        this.name = name;
        this.description = description;
        this.colorCode = colorCode;
        this.availableWeeklyHours = availableWeeklyHours;
        this.availableDailyHours = availableDailyHours;
        this.tasks = [];
        this.teams = [];
        this.skills = skills;
        this.upcomingSkills = upcomingSkills;            
    }    

    public refreshSkills() {
        this.upcomingSkills.filter(skill => skill.isAcquired())
                           .forEach(skill => this.skills.push(skill));
                           
        this.upcomingSkills = this.upcomingSkills.filter(skill => !skill.isAcquired());
    }

    public getCurrentSkills() {
        return this.skills.concat(
            this.upcomingSkills.filter(skill => skill.isAcquired())
        );
    }

    public addSkill(skill: Skill) {
        if (!this.skills.includes(skill)) {
            this.skills.push(skill);
        }
    }

    public addSkills(skills: Skill[]) {
        skills.forEach(skill => this.addSkill(skill));
    }

    public addUpcomingSkill(skill: UpcomingSkill) {
        if (skill.isAcquired()) {
            this.addSkill(skill);
            return;
        }

        if (!this.upcomingSkills.includes(skill)) {
            this.upcomingSkills.push(skill);
        }        
    }
    
    public addUpcomingSkills(skills: UpcomingSkill[]) {
        skills.forEach(skill => this.addUpcomingSkill(skill));
    }

    public removeSkillFromName(name: string) {
        this.skills = this.skills.filter(skill => skill.name !== name);
        this.upcomingSkills = this.upcomingSkills.filter(skill => skill.name !== name);
    }

    public removeSkill(skill: Skill) {
        this.skills = this.skills.filter(s => skill !== s);        
    }

    public removeUpcomingSkill(skill: UpcomingSkill) {
        this.upcomingSkills = this.upcomingSkills.filter(s => skill !== s);        
    }

    public removeTask(task: Task) {
        this.tasks = this.tasks.filter(t => t.uuid !== task.uuid);
    }

    public renameSkill(oldName: string, newName: string) {
        this.skills.filter(skill => skill.name == oldName).forEach(skill => skill.name = newName);
    }

    public addToTeam(team: Team) {
        if (this.teams.includes(team)) {
            return;
        }

        this.teams.push(team);

        team.addMember(this);
    }

    public asSerializedData(): any {
        return {
            uuid: this.uuid,
            name: this.name,
            description: this.description,
            colorCode: this.colorCode,
            availableDailyHours: this.availableDailyHours,
            availableWeeklyHours: this.availableWeeklyHours,
            skills: this.skills.map(skill => skill.asSerializedData()),
            upcomingSkills: this.upcomingSkills.map(skill => skill.asSerializedData())
        };
    }

    public static fromUnparsedData(data: any): Member {
        return new Member(data.uuid, data.name, 
                          data.description,
                          data.colorCode,
                          data.availableDailyHours,
                          data.availableWeeklyHours,
                          data.skills.map((s: any) => Skill.fromUnparsedData(s)),
                          data.upcomingSkills.map((s: any) => UpcomingSkill.fromUnparsedData(s)));
    }
}