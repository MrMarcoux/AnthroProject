import { Member } from "@/models/member";
import { uuid } from 'uuidv4';
import { Model } from '@/models/model';
import { Team } from '@/models/team';

describe('Adding a member ', () => {
    it('should enlarge member list', () => {    
        const newMember = new Member(uuid(), 'Dummy','','FFFFFF', 5, 5, [], []);
        const team = new Team(uuid(), 'Dummy', 'FFFFFF', '');

        let previousLength = team.members.length;
        team.addMember(newMember);
        let currentLength = team.members.length;
        expect(previousLength).toBeLessThan(currentLength);        
    }),
    it('should not enlarge member list', () => {    
        const newMember = new Member(uuid(), 'Dummy','','FFFFFF', 5, 5, [], []);
        const team = new Team(uuid(), 'Dummy', 'FFFFFF', '');
        team.addMember(newMember);
        
        let previousLength = team.members.length;
        team.addMember(newMember);
        let currentLength = team.members.length;
        expect(previousLength).toEqual(currentLength);   
    })
});

describe('Removing a member ', () => {
    it('should reduce member list', () => {    
        const newMember = new Member(uuid(), 'Dummy','','FFFFFF', 5, 5, [], []);
        const team = new Team(uuid(), 'Dummy', 'FFFFFF', '');

        team.addMember(newMember);
        let previousLength = team.members.length;
        team.removeMember(newMember);
        let currentLength = team.members.length;
        expect(previousLength).toBeGreaterThan(currentLength);        
    }),
    it('should not reduce member list', () => {    
        const newMember = new Member(uuid(), 'Dummy','','FFFFFF', 5, 5, [], []);
        const team = new Team(uuid(), 'Dummy', 'FFFFFF', '');
        team.addMember(new Member(uuid(), 'Dummy','','FFFFFF', 5, 5, [], []));
        
        let previousLength = team.members.length;
        team.removeMember(newMember);
        let currentLength = team.members.length;
        expect(previousLength).toEqual(currentLength);   
    })
});

describe('Adding members ', () => {
    it('should enlarge member list', () => {
        const persistentMember1 = new Member(uuid(), 'Dummy','','FFFFFF', 5, 5, [], []);
        const persistentMember2 = new Member(uuid(), 'Dummy','','FFFFFF', 5, 5, [], []);
        const nonPersistentMember = new Member(uuid(), 'Dummy','','FFFFFF', 5, 5, [], []);
        const memberListToAdd = [persistentMember1, persistentMember2, nonPersistentMember];
        const team = new Team(uuid(), 'Dummy', 'FFFFFF', '');

        team.addMember(persistentMember1);

        let previousLength = team.members.length;
        team.addMembers(memberListToAdd);
        let currentLength = team.members.length;
        expect(previousLength).toBeLessThan(currentLength);
        expect(currentLength).toEqual(memberListToAdd.length);        
    })
});
