import { Task } from "./task.js";
import { storage } from "./Storage.js"

window.onload = function() {
    console.log("App started");
    taskList.init();
}


class TaskList{
    constructor(){
        this.tasks = [];
        this.numberOfTask = 0;
    }

    modalWindow = null;

    init(){
        document.querySelector("#addBtn").addEventListener("click", e => this.addBtn(e));
        this.loadDataFromStorage();
        this.initModal();
    }
    
    initModal = () => {
        this.modalWindow = new bootstrap.Modal(document.getElementById("modalWindow"));
        document.getElementById("closeModal").addEventListener('click', this.clear());
    }

    loadDataFromStorage() {
        const data = storage.getItems();
        if(data == null || data == undefined) return;
        this.tasks = data;
        const result = data.map( el => this.taskToTable(el));
    }

    addBtn(e){
        const description = document.querySelector("#description").value;

        if(description === ""){
            return;
        }

        e.preventDefault(); 
        
        const task = new Task(description);
        this.addTask(task);
    }

    addTask(task){
        this.tasks.push(task);
        this.taskToTable(task);
        
        storage.setItems(this.tasks);
    }

    removeTask(e){
        const taskId = e.target.getAttribute("data-task-id");
        e.target.parentElement.parentElement.remove();
        
     
        this.tasks.forEach( (key, value) => {
            if(value.id == taskId){
                this.tasks.splice(key, 1);
            }
        });

        storage.setItems(this.tasks);
    }

    editTask(e){
        const taskId = e.target.parentElement.parentElement;
        const tdElements = taskId.querySelectorAll('td');
        const tdElement = tdElements[1];

        const modalParagraph = document.querySelector("#modalResults");
        let information = tdElement.textContent;
        
        modalParagraph.innerHTML = information;
        this.modalWindow.toggle();
    }

    taskToTable(task){
        const tbody = document.querySelector("#taskTable tbody");
        const tr = document.createElement("tr");
        const numberOfItems = task;
        const result = numberOfItems.id !== task.id ? this.numberOfTask  : this.numberOfTask++;

        tr.innerHTML = `
        <td>  ${result} </td>
        <td> ${task.description} </td>
        <td>
        <button type="button" data-task-id="${task.id}" class="btn btn-success btn-sm done">✔️</button>
        <button type="button" data-task-id="${task.id}" class="btn btn-info btn-sm edit">✎</button>
        <button type="button" data-task-id="${task.id}" class="btn btn-danger btn-sm delete">𐌗</button>
        </td>
        `;

        tbody.appendChild(tr);
        this.clear();

        let deleteButton = document.querySelector(`button.delete[data-task-id='${task.id}']`);
        deleteButton.addEventListener("click", (e) => this.removeTask(e));

        let editButton = document.querySelector(`button.edit[data-task-id='${task.id}']`);
        editButton.addEventListener("click", (e) => this.editTask(e));
        


    }

    clear(){
       document.querySelector("#description").value = "";
    }

}

export const taskList = new TaskList();