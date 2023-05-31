export class Task{
    constructor(id, description){
        this.id = Date.now();
        this.description = description;
    }
}