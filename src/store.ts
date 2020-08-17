import { Model } from './models/model';

class UniqueStore {
    public model: Model;
    public foo: number;
    private static instance: UniqueStore;
    private constructor() { 
        this.model = new Model();
        this.foo = 5;
    }

    public static getInstance(): UniqueStore {
        if (!UniqueStore.instance) {
            UniqueStore.instance = new UniqueStore();
        }

        return UniqueStore.instance;
    }
}

function getStore() {
    return UniqueStore.getInstance();
}

export { getStore as getStore }