import { Project } from './project';
import { Skill } from './skill';
import { Member } from './member';
import { UpcomingSkill } from './upcomingskill';
import { Team } from './team';
import { DateFormatter } from './DateFormatter';
import { faTasks } from '@fortawesome/free-solid-svg-icons';

export class Task {
    readonly uuid: string;
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
    completionPercent: number;
    
    assignees: Member[];
    requiredSkills: Skill[];


    constructor(uuid: string, name: string, description: string, start: Date, end: Date, durationMin: number, project?: Project){
        this.uuid = uuid;
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
        this.completionPercent = 0;

        this.assignees = [];
        this.requiredSkills = [];
    }

    getRequiredSkills(): Skill[]{
        return this.requiredSkills;
    }

    isMemberQualifed(member: Member): boolean {
        return (this.missingSkillsForMember(member).length === 0);
    }

    isMemberQualifiableBeforeStart(member: Member): boolean {
        const qualificationDate = this.qualificationDateForMember(member);
        
        if (qualificationDate === null) {
            return false;
        }

        return qualificationDate < this.start;
    }

    missingSkillsForMember(member: Member): Skill[] {
        const missingSkills = [];

        for (const skill of this.requiredSkills) {
            const correspondingSkill = member.skills.find(s => s.name == skill.name);

            if (correspondingSkill === undefined) {
                missingSkills.push(skill);
            } else if (correspondingSkill.level < skill.level) {
                missingSkills.push(skill);
            }
        }

        return missingSkills;
    }

    missingUpcomingSkillsForMember(member: Member): UpcomingSkill[] {
        return member.upcomingSkills.filter(upSkill => this.missingSkillsForMember(member).map(skill => skill.name)
                                                                                          .includes(upSkill.name));
    }

    relevantUpcomingSkills(member: Member): UpcomingSkill[] {
        return member.upcomingSkills.filter(skill => this.missingSkillsForMember(member).some(requ => requ.name == skill.name && requ.level <= skill.level));
    }

    insufficientUpcomingSkills(member: Member): UpcomingSkill[] {
        return member.upcomingSkills.filter(skill => this.missingSkillsForMember(member).some(requ => requ.name == skill.name && requ.level > skill.level));
    }

    insufficientSkills(member: Member): Skill[] {
        return member.skills.filter(skill => this.missingSkillsForMember(member).some(requ => requ.name == skill.name));
    }

    entirelyMissingSkills(member: Member): Skill[] {
        const skills: Skill[] = [];

        for (const skill of this.requiredSkills) {
            if (skills.includes(skill)) {
                continue;
            }

            if (!member.upcomingSkills.map(s => s.name).includes(skill.name) && 
                !member.skills.map(s => s.name).includes(skill.name)) {
                skills.push(skill);
            }
        }

        return skills;
    }

    qualificationDateForMember(member: Member): Date | null {

        if (this.isMemberQualifed(member) || this.requiredSkills.length === 0) {
            return null;
        }

        const relevantSkills = member.upcomingSkills.filter(skill => this.missingSkillsForMember(member).some(requ => requ.name == skill.name && requ.level <= skill.level));

        for (const requ of this.requiredSkills) {
            if (!relevantSkills.some(skill => skill.name == requ.name)
             && !member.skills.some(skill => skill.name == requ.name)) {
                return null; //This means the member will never be qualified
             }
        }
        
        const lastSkillNecessary = this.findLastAcquiredSkill(relevantSkills);

        return lastSkillNecessary.aquisitionDate;
    }

    findLastAcquiredSkill(upcomingSkills: UpcomingSkill[]): UpcomingSkill {

        const dateArray = upcomingSkills.map(upcomingSkills => upcomingSkills.getAquisitionDate().getTime());

        const lastDate = Math.max(...dateArray);
        const indexLastDate = dateArray.indexOf(lastDate);

        return upcomingSkills[indexLastDate];

    }

    isAssigned(): boolean{
        return (this.assignees.length > 0);
    }

    tryAssignMember(member: Member) {
        if(this.assignees.includes(member)) {throw new Error("the member is already here");}
        if(!this.isMemberQualifed(member)){throw new Error("the member is not qualified");}

        this.assignees.push(member);
    }

    tryAssignMembers(members: Member[]) {
        members.forEach(member => this.tryAssignMember(member));
    }

    forceAssignMember(member: Member){

        if(this.assignees.includes(member)) {throw new Error("the member is already here");}

        this.assignees.push(member);
    }

    getAssignedMembers(): Member[]{
        return this.assignees;
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
    addSubTask(task: Task): void {
        if (this.subTasks.includes(task)) {
            throw new Error('Subtask is already associated');
        }

        task.project = this.project;

        this.subTasks.push(task);
    }

    addPredecessor(task: Task) {
        if (this.predecessors.includes(task)) {
            throw new Error('Predecessor is already associated');
        }

        task.addSuccessor(this);

        this.predecessors.push(task);
    }

    removePredecessor(task: Task) {
        task.successors = task.successors.filter(t => t !== this);

        this.predecessors = this.predecessors.filter(t => t !== task);
    }

    removePredecessors(tasks: Task[]) {
        tasks.forEach(task => this.removePredecessor(task));
    }

    removePredecessorRecursively(task: Task) {
        this.removePredecessor(task);

        this.subTasks.forEach(t => t.removePredecessorRecursively(task));
    }

    removePredecessorsRecursively(tasks: Task[]) {
        this.removePredecessors(tasks);

        this.subTasks.forEach(t => t.removePredecessorsRecursively(tasks));
    }

    private addSuccessor(task: Task) {
        if (this.successors.includes(task)) {
            throw new Error('Sucessors is already associated');
        }

        this.successors.push(task);
    }


    removeTeamMembers(team: Team) {
        this.assignees = this.assignees.filter(member => !team.members.includes(member));
        this.subTasks.forEach(task => task.removeTeamMembers(team));    
    }

    removeMember(member: Member) {
        this.assignees = this.assignees.filter(mbr => mbr !== member);
        this.subTasks.forEach(task => task.removeMember(member));
    }

    removeAssignee(member: Member) {
        member.removeTask(this);
        this.assignees = this.assignees.filter(m => m.uuid != member.uuid);
    }

    formattedStart(): string {
        return DateFormatter.formatDateForDisplay(this.start);
    }

    formattedEnd(): string {
        return DateFormatter.formatDateForDisplay(this.end);
    }

    removeSubtask(subtask: Task) {
        this.subTasks = this.subTasks.filter(task => task !== subtask);
    }

    removeSubtaskRecursively(subtask: Task) {
        this.removeSubtask(subtask);
        this.subTasks.forEach(t => t.removeSubtaskRecursively(subtask));
    }

    removeSkill(skill: Skill) {
        this.requiredSkills = this.requiredSkills.filter(s => s !== skill);
        this.subTasks.forEach(task => task.removeSkill(skill));
    }

    removeSkillFromName(name: string) {
        this.requiredSkills = this.requiredSkills.filter(s => s.name !== name);
        this.subTasks.forEach(task => task.removeSkillFromName(name));
    }

    renameSkill(oldName: string, newName: string) {
        for (const skill of this.requiredSkills) {
            if (skill.name === oldName) {
                skill.name = newName;
            }
        }

        this.subTasks.forEach(task => task.renameSkill(oldName, newName));
    }

    updatePredecessors(tasks: Task[]) {
        this.predecessors.filter(t => !tasks.includes(t)).forEach(t => this.removePredecessor(t));
        tasks.filter(t => !this.predecessors.includes(t)).forEach(t => this.addPredecessor(t));        
    }

    toFlatList(): Task[] {
        const list = this.subTasks.flatMap(t => t.toFlatList());
        list.push(this);
        return list;
    }

    public asSerializedData(): any {
        return {
            uuid: this.uuid,
            name: this.name,
            description: this.description,
            start: DateFormatter.formatDateForDisplay(this.start),
            end: DateFormatter.formatDateForDisplay(this.end),
            duration: this.duration,
            completed: this.completed,
            completionPercent: this.completionPercent,
            subTasks: this.subTasks.map(task => task.asSerializedData()),
            predecessors: this.predecessors.map(task => task.uuid),
            successors: this.successors.map(task => task.uuid),
            assignees: this.assignees.map(assignee => assignee.uuid),
            requiredSkills: this.requiredSkills.map(skill => skill.asSerializedData())
        };
    }

    public static fromUnparsedData(parentProject: Project, availableMembers: Member[], data: any): Task {
        const endDate = new Date(Date.parse(data.end as string) + 1);
        endDate.setDate(endDate.getDate() + 1);
        
        const startDate = new Date(Date.parse(data.start as string) + 1);
        startDate.setDate(startDate.getDate() + 1);

        const task = new Task(data.uuid, data.name, data.description, startDate, endDate, 0, parentProject);
        task.completionPercent = data.completionPercent;
        task.completed = data.completed;
        task.requiredSkills = data.requiredSkills.map((s: any) => Skill.fromUnparsedData(s));
        task.assignees = availableMembers.filter(m => data.assignees.includes(m.uuid));
        task.subTasks = data.subTasks.map((t: any) => Task.fromUnparsedData(parentProject, availableMembers, t));

        return task;
    }

    public parseLocusesFromData(availableTasks: Task[], data: any) {
        this.predecessors = availableTasks.filter(t => data.predecessors.includes(t.uuid));
        this.successors = availableTasks.filter(t => data.predecessors.includes(t.uuid));
        
        for (const subTaskData of data.subTasks) {
            const subTask = this.subTasks.find(s => s.uuid === subTaskData.uuid);

            subTask?.parseLocusesFromData(availableTasks, subTaskData);
        }
    }
}