export class Skill {

    name: string;
    level: number;

    /**constructor */
    constructor(name: string , level: number) {
        this.name = name;
        this.level = level;
    }

    public asSerializedData(): any {
        return {
            name: this.name,
            level: this.level
        };
    }

    public static fromUnparsedData(data: any): Skill {
        return new Skill(data.name, data.level);
    }
}