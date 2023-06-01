class Storage{
    setItems(tasks){
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }
    getItems(){
        let tasks = null;
        if(localStorage.getItem("tasks")){
            tasks = JSON.parse(localStorage.getItem("tasks"));
        }else{
            tasks == [];
        }
        return tasks;
    }
}

export const storage = new Storage();