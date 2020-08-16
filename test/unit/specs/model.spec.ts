import { Model } from "@/models/model";

describe('Adding available skill ', () => {
    it('should enlarge skills list', () => {    
        const newSkill = 'non-existing';
        const model = new Model();

        model.availableSkills = ['existing'];

        let previousLength = model.availableSkills.length;
        model.addSkill(newSkill);
        let currentLength = model.availableSkills.length;
        expect(previousLength).toBeLessThan(currentLength);        
    }),
    it('should not enlarge skills list', () => {    
        const persistentSkill = 'existing';
        const model = new Model();

        model.availableSkills = [persistentSkill];

        let previousLength = model.availableSkills.length;
        model.addSkill(persistentSkill);
        let currentLength = model.availableSkills.length;
        expect(previousLength).toEqual(currentLength);
    })
});

describe('Adding available skills ', () => {
    it('should enlarge skills list', () => {    
        const persistentSkill1 = 'existing1'
        const persistentSkill2 = 'existing2'
        const newSkill = 'non-existing';
        const originalSkills = [persistentSkill1, persistentSkill2]
        const addedSkills =[persistentSkill1, newSkill];
        const model = new Model();
        model.availableSkills = originalSkills;

        let previousLength = model.availableSkills.length;
        model.addSkills(addedSkills);
        let currentLength = model.availableSkills.length;
        expect(currentLength).toEqual(previousLength + addedSkills.length - 1);        
    })
});

describe('Deleting available skill ', () => {
    it('should reduce skills list', () => {    
        const undesirableSkill = 'non-existing';
        const model = new Model();

        model.availableSkills = ['existing', undesirableSkill];

        let previousLength = model.availableSkills.length;
        model.deleteSkill(undesirableSkill);
        let currentLength = model.availableSkills.length;
        expect(previousLength).toBeGreaterThan(currentLength);
    }),
    it('should not reduce skills list', () => {    
        const undesirableSkill = 'non-existing';
        const model = new Model();

        model.availableSkills = [undesirableSkill];

        let previousLength = model.availableSkills.length;
        model.addSkill(undesirableSkill);
        let currentLength = model.availableSkills.length;
        expect(previousLength).toEqual(currentLength);
    })
});

describe('Deleting available skills ', () => {
    it('should reduce skills list', () => {    
        const persistentSkill1 = 'existing1'
        const persistentSkill2 = 'existing2'
        const newSkill = 'non-existing';
        const originalSkills = [persistentSkill1, persistentSkill2];
        const undesirableSkills = [persistentSkill1, newSkill];
        const model = new Model();
        model.availableSkills = originalSkills;

        let previousLength = model.availableSkills.length;
        model.addSkills(undesirableSkills);
        let currentLength = model.availableSkills.length;
        expect(previousLength).toEqual(currentLength - undesirableSkills.length + 1);        
    })
});