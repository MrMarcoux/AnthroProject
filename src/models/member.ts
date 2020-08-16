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
    tasks: Task[];
    teams: Team[];
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

    public removeSkill(name: string) {
        this.skills = this.skills.filter(skill => skill.name !== name);
        this.upcomingSkills = this.upcomingSkills.filter(skill => skill.name !== name);
    }
}