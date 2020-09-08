import { Skill } from './skill';
import { DateFormatter } from './DateFormatter';

export class UpcomingSkill extends Skill {
    
    aquisitionDate: Date;

    constructor(name: string , level: number , date: Date){

        super(name,level);
        this.aquisitionDate = date;
    }

    /**getter */
    public getAquisitionDate(): Date {
        return this.aquisitionDate;
    }

    /**
     * @returns true if the skill is aquired
     */
    isAcquired(): boolean{

        const today = new Date();
        
        return (this.aquisitionDate.getTime() <= today.getTime());
    }

    formattedDate(): string {
        return DateFormatter.formatDateForDisplay(this.aquisitionDate);
    }

}
