import { Project } from './project';
import { Task } from './task';
import { UpcomingSkill } from './upcomingskill';
import { Skill } from './skill';
import { Team } from './team';

export class Member {
    name: string;
    description: string;
    colorCode: string;
    availableWeeklyHours: number;
    availableDailyHours: number;
    tasks: Task[];
    teams: Team[];
    skills: Skill[];
    upcomingSkills: UpcomingSkill[];

    constructor(name: string, description: string, colorCode: string, 
                availableWeeklyHours: number, availableDailyHours: number,
                skills: Skill[], upcomingSkills: UpcomingSkill[],) {
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

    public addUpcomingSkill(skill: UpcomingSkill) {
        if (skill.isAcquired()) {
            this.addSkill(skill);
            return;
        }

        if (!this.upcomingSkills.includes(skill)) {
            this.upcomingSkills.push(skill);
        }        
    }    
}