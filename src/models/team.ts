import { Member } from './member';

export class Team {
    readonly uuid: string;
    name: string;
    colorCode: string;
    description: string;
    members: Member[];

    constructor(uuid: string, name: string, colorCode: string, description: string) {
        this.uuid = uuid;
        this.name = name;
        this.description = description;
        this.colorCode = colorCode;
        this.members = [];
    }

    public addMember(member: Member): boolean {
        if (this.members.includes(member)) {
            return false;
        }

        this.members.push(member);

        member.addToTeam(this);

        return true;
    }

    public addMembers(members: Member[]) {
        members.forEach(member => this.addMember(member));
    }

    public removeMember(member: Member): boolean {
        if (this.members.includes(member)) {
            this.members = this.members.filter(m => m !== member);
            return true;
        }

        return false;
    }
}