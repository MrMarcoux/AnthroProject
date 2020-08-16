import { Member } from '../../../src/models/member';
import { uuid } from 'uuidv4';
import { UpcomingSkill } from '@/models/upcomingskill';
import { Skill } from '@/models/skill';

describe('Refreshing skills ', () => {
    it('should displace upcoming skills', () => {
        let passedDate = new Date();
        passedDate.setDate(passedDate.getDate() - 5); 
        let futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 5);
        
        const upcomingSkills = [new UpcomingSkill('Passed', 5, passedDate),
                                new UpcomingSkill('Future', 5, futureDate)];
        
        const member = new Member(uuid(), 'Dummy','','FFFFFF', 5, 5, [], upcomingSkills);
        
        expect(member.upcomingSkills.length).toEqual(2);
        expect(member.getCurrentSkills().length).toEqual(1);
        member.refreshSkills();
        expect(member.getCurrentSkills().length).toEqual(1);
        expect(member.upcomingSkills.length).toEqual(1);
        expect(member.skills.length).toEqual(1);
    }),
    it('should not displace upcoming skills', () => {
        let futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 5);
        
        const upcomingSkills = [new UpcomingSkill('Future', 5, futureDate),
                                new UpcomingSkill('Future', 5, futureDate)];
        
        const member = new Member(uuid(), 'Dummy','','FFFFFF', 5, 5, [], upcomingSkills);
        
        expect(member.upcomingSkills.length).toEqual(2);
        expect(member.getCurrentSkills().length).toEqual(0);
        member.refreshSkills();
        expect(member.getCurrentSkills().length).toEqual(0);
        expect(member.upcomingSkills.length).toEqual(2);
        expect(member.skills.length).toEqual(0);
    })
});

describe('Adding skill ', () => {
    it('should enlarge skillset', () => {    
        const skills = [new Skill('Existing', 5)];
        
        const member = new Member(uuid(), 'Dummy','','FFFFFF', 5, 5, skills, []);
        
        let previousLength = member.skills.length;
        member.addSkill(new Skill('Non-existing', 5));
        let currentLength = member.skills.length;
        expect(previousLength).toBeLessThan(currentLength);
    }),
    it('should not enlarge skillset', () => {
        const skill = new Skill('Existing', 5);
        const skills = [skill];
        
        const member = new Member(uuid(), 'Dummy','','FFFFFF', 5, 5, skills, []);
        
        let previousLength = member.skills.length;
        member.addSkill(skill);
        let currentLength = member.skills.length;
        expect(previousLength).toEqual(currentLength);
    })
});

describe('Adding upcoming skill ', () => {
    it('should enlarge upcoming skillset', () => {    
        let futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 5);
        
        const skills = [new UpcomingSkill('Existing', 5, futureDate)];
        const member = new Member(uuid(), 'Dummy','','FFFFFF', 5, 5, [], skills);
        
        let previousLength = member.upcomingSkills.length;
        member.addUpcomingSkill(new UpcomingSkill('Non-existing', 5, futureDate));
        let currentLength = member.upcomingSkills.length;
        expect(previousLength).toBeLessThan(currentLength);
    }),
    it('should not enlarge upcoming skillset', () => {
        let futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 5);

        const skill = new UpcomingSkill('Existing', 5, futureDate);
        const skills = [skill];
        
        const member = new Member(uuid(), 'Dummy','','FFFFFF', 5, 5, [], skills);
        
        let previousLength = member.upcomingSkills.length;
        member.addUpcomingSkill(skill);
        let currentLength = member.upcomingSkills.length;
        expect(previousLength).toEqual(currentLength);
    })
  });

  describe('Adding skills ', () => {
    it('should enlarge skillset with unexisting skills', () => {    
        const persistentSkill = new Skill('Existing', 5); 
        
        const startSkills = [new Skill('Existing', 5),
                             new Skill('Existing', 5),
                             persistentSkill];

        const addedSkills = [new Skill('Non-existing', 5),
                             new Skill('Non-existing', 5),
                             persistentSkill];

        const member = new Member(uuid(), 'Dummy','','FFFFFF', 5, 5, startSkills, []);
        
        let previousLength = member.skills.length;
        member.addSkills(addedSkills);
        let currentLength = member.skills.length;
        expect(previousLength).toBeLessThan(currentLength);
        expect(currentLength).toEqual((previousLength + addedSkills.length) - 1);
    })
});

describe('Adding upcoming skills ', () => {
    it('should enlarge upcoming skillset with unexisting upcoming skills', () => {    
        let futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 5);

        const persistentSkill = new UpcomingSkill('Existing', 5, futureDate); 
        
        const startSkills = [new UpcomingSkill('Existing', 5, futureDate),
                             new UpcomingSkill('Existing', 5, futureDate),
                             persistentSkill];

        const addedSkills = [new UpcomingSkill('Existing', 5, futureDate),
                             new UpcomingSkill('Existing', 5, futureDate),
                             persistentSkill];

        const member = new Member(uuid(), 'Dummy','','FFFFFF', 5, 5, [], startSkills);
        
        let previousLength = member.upcomingSkills.length;
        member.addUpcomingSkills(addedSkills);
        let currentLength = member.upcomingSkills.length;
        expect(previousLength).toBeLessThan(currentLength);
        expect(currentLength).toEqual((previousLength + addedSkills.length) - 1);
    })
});

describe('Remove skill ', () => {
    it('should remove corresponding skill', () => {    
        let futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 5);
        const undesirableSkillName = "Deleted";

        const skills = [new Skill('Existing', 5),
                        new Skill('Existing', 5),
                        new Skill(undesirableSkillName, 5)];

        const upcomingSkills = [new UpcomingSkill('Existing', 5, futureDate),
                                new UpcomingSkill('Existing', 5, futureDate),
                                new UpcomingSkill(undesirableSkillName, 5, futureDate)];

        const member = new Member(uuid(), 'Dummy','','FFFFFF', 5, 5, skills, upcomingSkills);
        
        let previousLength = member.upcomingSkills.length;
        let previousUpcomingLength = member.upcomingSkills.length;        
        member.removeSkill(undesirableSkillName);
        let currentLength = member.upcomingSkills.length;
        let currentUpcomingLength = member.upcomingSkills.length;        
        expect(previousLength).toBeGreaterThan(currentLength);
        expect(previousUpcomingLength).toBeGreaterThan(currentUpcomingLength);
    })
});