import { Skill } from './skill';
import { DateFormatter } from './DateFormatter';

export class UpcomingSkill extends Skill {
    
    aquisitionDate: Date;

    constructor(name: string , level: number , date: Date){

        super(name,level);
        this.aquisitionDate = date;
    }

    public getAquisitionDate(): Date {
        return this.aquisitionDate;
    }

    public isAcquired(): boolean {
        const today = new Date();
        
        return (this.aquisitionDate.getTime() <= today.getTime());
    }

    public formattedDate(): string {
        return DateFormatter.formatDateForDisplay(this.aquisitionDate);
    }

    public asSerializedData(): any {
        return {
            name: this.name,
            level: this.level,
            acquisitionDate: DateFormatter.formatDateForDisplay(this.aquisitionDate)
        }
    }
    
    public static fromUnparsedData(data: any): UpcomingSkill {
        const date = new Date(Date.parse(data.date as string) + 1);
        date.setDate(date.getDate() + 1);

        return new UpcomingSkill(data.name, data.level, date);
    }
}
