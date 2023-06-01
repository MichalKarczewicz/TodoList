export class Task{
    constructor(description){
        this.description = description;
        this.id = Date.now();
    }
}