import { Project } from "@/models/project";
import { uuid } from 'uuidv4';
import { Task } from '@/models/task';

describe('Adding task ', () => {
    it('should enlarge task list', () => {
        const project = new Project(uuid(), 'dummy', '','FFFFFF');
        const persistentTask = new Task(uuid(), 'Persistent', '', new Date(), new Date(), 60, project);
        const taskList = [new Task(uuid(), 'New', '', new Date(), new Date(), 60, project),
                          new Task(uuid(), 'New', '', new Date(), new Date(), 60, project)];

        project.tasks = taskList;

        let previousLength = project.tasks.length;
        project.addTask(persistentTask);        
        let currentLength = project.tasks.length;
        expect(previousLength).toBeLessThan(currentLength);        
    }),
    it('should not enlarge task list', () => {    
        const project = new Project(uuid(), 'dummy', '','FFFFFF');
        const persistentTask = new Task(uuid(), 'Persistent', '', new Date(), new Date(), 60, project);
        const taskList = [new Task(uuid(), 'New', '', new Date(), new Date(), 60, project),
                          new Task(uuid(), 'New', '', new Date(), new Date(), 60, project),
                          persistentTask];

        project.tasks = taskList;

        let previousLength = project.tasks.length;
        project.addTask(persistentTask);        
        let currentLength = project.tasks.length;
        expect(previousLength).toEqual(currentLength);   
    })
});