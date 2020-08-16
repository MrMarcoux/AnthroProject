export class Skill {

    name : string;
    level : number;

    /**constructor */
    constructor(name : string , level : number){
        this.name = name;
        this.level = level;
    }
    
    /**getter */
    public getName() : string {
        return this.name;
    }

    public getLevel() : number {
        return this.level;
    }
    
    /**setter */
    public setName(name : string) {
        this.name = name;
    }

    public setLevel(level : number) {
        this.level = level;
    }
    
    
}