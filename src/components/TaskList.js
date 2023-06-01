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
        document.getElementById("closeModal").addEventListener('click', () =>  this.modalWindow.toggle());
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
        
     
        this.tasks.forEach( (value, key) => {
            if(value.id == taskId){
                this.tasks.splice(key, 1);
            }
        });

        storage.setItems(this.tasks);
    }

    editTask(e){
        const task = e.target.parentElement.parentElement;
        const taskId = e.target.getAttribute("data-task-id");
        const tdElements = task.querySelectorAll('td');
        const tdElement = tdElements[1];
        let modalInput = document.querySelector("#modalResults");
        let information = tdElement.textContent;
        modalInput.value = information;
        
        let saveButton = document.querySelector("#saveModal");
        saveButton.addEventListener("click", () => {
            const value = document.querySelector("#modalResults").value;
            this.saveBtn(taskId, value);
          });

        this.modalWindow.toggle();
    }
    
    doneTask(e){
        const task = e.target.parentElement.parentElement;
        const taskId = e.target.getAttribute("data-task-id");
        const tdElements = task.querySelectorAll('td');
        const tdDescription = tdElements[1];
        const tdNumber = tdElements[0];
        tdDescription.classList.toggle("taskDone");
        tdNumber.classList.toggle("taskDone");
    }

    saveBtn(taskId, information){
        let arr = this.tasks;
        console.log(taskId, information);

        for(let i=0;i< arr.length;i++){
            let el = arr[i];
            if(el.id == taskId){
                console.log(arr[i].description);
                arr[i].description = information;
            }
        }
        storage.setItems(this.tasks);
        this.deleteAllRows();
        this.loadDataFromStorage();
    }

    deleteAllRows(){
        const tbody = document.querySelectorAll("#taskTable tbody tr");
        tbody.forEach( item => {
            item.remove();
        })
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
        
        let doneButton = document.querySelector(`button.done[data-task-id='${task.id}']`);
        doneButton.addEventListener("click", (e) => this.doneTask(e));


    }

    clear(){
       document.querySelector("#description").value = "";
    }

}

export const taskList = new TaskList();