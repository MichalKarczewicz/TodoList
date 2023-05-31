import { Task } from "./task.js";

window.onload = function() {
    console.log("App started");
    taskList.init();
}


class TaskList{
    constructor(){
        this.tasks = [];
    }

    init(){
        console.log("Inicjalizacja TaskList")
    }
}

const taskList = new TaskList();