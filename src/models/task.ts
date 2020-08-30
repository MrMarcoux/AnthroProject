import { Project } from './project';
import { Skill } from './skill';
import { Member } from './member';
import { UpcomingSkill } from './upcomingSkill';
import { Team } from './team';

export class Task {
    name: string;
    description: string;
    
    subTasks: Task[];  
    project?: Project;
    predecessors: Task[];
    successors: Task[];

    start: Date;
    end: Date;
    duration: number;
    completed: boolean;
    
    private assignedMembers: Member[];
    private requiredSkills: Skill[];


    constructor(name: string,description: string, start: Date, end: Date, durationMin: number, project?: Project){
        this.name = name;
        this.description = description;

        this.subTasks = [];
        this.project = project;
        this.predecessors = [];
        this.successors = [];

        this.start = start;
        this.end = end;
        this.duration = durationMin;
        this.completed = false;

        this.assignedMembers = [];
        this.requiredSkills = [];
    }

    getRequierdSkill(): Skill[]{
        return this.requiredSkills;
    }

    isMemberQualifed(member: Member): boolean{
        return (this.missingSkillsForMember(member).length > 0);
    }

    missingSkillsForMember(member: Member): string[]{
        return this.requiredSkills.filter(skill => !member.getCurrentSkills().includes(skill))
                                  .map(skill => skill.name);

    }

    qualificationDateForMember(member: Member): Date{
        
        const lastSkillNessesary = this.findLastAquiredSkill(member.upcomingSkills);

        return lastSkillNessesary.aquisitionDate;
    }

    findLastAquiredSkill(upcomingSkills: UpcomingSkill[]): UpcomingSkill{

        const dateArray = upcomingSkills.map(upcomingSkills => upcomingSkills.getAquisitionDate().getTime());

        const lastDate = Math.max(...dateArray);
        const indexLastDate = dateArray.indexOf(lastDate);

        return upcomingSkills[indexLastDate];

    }

    isAssigned(): boolean{
        return (this.assignedMembers.length > 0);
    }

    tryAssignMember(member: Member){

        if(this.assignedMembers.includes(member)) {throw new Error("the member is already here");}
        if(!this.isMemberQualifed(member)){throw new Error("the member is not qualified");}

        this.assignedMembers.push(member);

    }

    forceAssignMember(member: Member){

        if(this.assignedMembers.includes(member)) {throw new Error("the member is already here");}

        this.assignedMembers.push(member);
    }

    getAssignedMember(): Member[]{
        return this.assignedMembers;
    }

    isLate(): boolean{
        return (this.end < new Date());    
    }

    /**
     * 
     * @param task to add in the subtask
     * 
     * @returns false if the task is already in the subTask array 
     */
    addSubTask(task: Task): boolean{

        if(this.subTasks.includes(task)){return false}

        this.subTasks.push(task);

        return true;
    }

    removeTeamMembers(team: Team) {
        this.assignedMembers = this.assignedMembers.filter(member => !team.members.includes(member))
        this.subTasks.forEach(task => task.removeTeamMembers(team));    
    }

    removeMember(member: Member) {
        this.assignedMembers = this.assignedMembers.filter(mbr => mbr !== member);
        this.subTasks.forEach(task => task.removeMember(member));
    }
}