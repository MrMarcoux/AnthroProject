import { UpcomingSkill } from "@/models/upcomingSkill";

describe('Checking if acquired ', () => {
    it('should return false', () => {
        let futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 5);

        const skill = new UpcomingSkill('Skill', 5, futureDate);

        expect(skill.isAcquired()).toBeFalsy();        
    }),
    it('should return true', () => {    
        let passedDate = new Date();
        passedDate.setDate(passedDate.getDate() - 5); 

        const skill = new UpcomingSkill('Skill', 5, passedDate);

        expect(skill.isAcquired()).toBeTruthy();
    })
});