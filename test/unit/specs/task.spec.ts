import { Task } from '../../../src/models/task'

describe('Task', () => {
  it('should be true', () => {
    const myTask = new Task();

    expect(myTask.someAttr).toEqual(1);
  })
})
