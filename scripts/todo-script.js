const jwt = sessionStorage.getItem('jwt');
import { getUser, getTasks, deleteTask, postTask, updateTask } from './helpers.js';

const form = document.querySelector('#todo-form'); 
const todoList = document.querySelector('.todos');
const totalTasks = document.querySelector('#total-tasks');
const completedTasks = document.querySelector('#completed-tasks');
const remainingTasks = document.querySelector('#remaining-tasks');
const input = document.querySelector('#todo-form input'); // form input

let tasks = JSON.parse(sessionStorage.getItem('tasks')) || [];

if (sessionStorage.getItem("tasks")) {
    tasks.map((task) => {
        createTask(task)
    }) 
}

form.addEventListener('submit',  async (e) =>{
    e.preventDefault()

    const inputValue = input.value; 
    if (inputValue == "") {
        return
    }
    const task = await postTask(jwt, inputValue)
    tasks.push(task)
    sessionStorage.setItem('tasks', JSON.stringify(tasks))

    createTask(task)
    form.reset();
    input.focus();
})


function createTask(task) {
    const taskEl = document.createElement('li')
    const buttonRemove = document.createElement('button');
    buttonRemove.classList.add('remove-task');
    buttonRemove.innerHTML = `<img src="./assets/deleteTask.svg" width="24" height="22" viewBox="0 0 24 22" >`
    buttonRemove.addEventListener('click', (e) => {
        removeTask(task.id, e)
    });

    taskEl.setAttribute('id', `li-${task.id}`)

    if(task.completed){
        taskEl.classList.add('complete')
    }
    const taskElMarkup = `
    <div class="for-heart">
    <input type="checkbox" name="tasks" class="heart-checkbox" name="tasks" id="${task.id}" ${task.completed ? 'checked' : ''}>
</div>
<div class="holder">
    <span ${!task.completed ? 'contenteditable' : ''} class="description">${task.description}</span>
    <span class="creation-date">
        <img src="./assets/calendar.svg" width="11" height="12" viewBox="0 0 11 12"> : 02/04/23</span> 

</div>
    <button id="edit-task" title="Edit task" class="edit-task">
        <img src="./assets/edit-btn.svg" width="22" height="22" viewBox="0 0 17 17" >
      
    </button>`

    taskEl.innerHTML = taskElMarkup;
    taskEl.appendChild(buttonRemove);
    todoList.appendChild(taskEl);
    countTasks();
}



function countTasks() {
    const completedTasksArray = tasks.filter((task) => {
        task.completed == true
    })
    totalTasks.textContent = tasks.length
    completedTasks.textContent = completedTasksArray.length
    remainingTasks.textContent = tasks.length - completedTasksArray.length
}

// function removeTask(taskId) {
//     tasks = tasks.filter((task) =>  {
//     task.id !== parseInt(taskId)
//     })
//     sessionStorage.setItem('tasks', JSON.stringify(tasks))
//     document.getElementById(taskId).remove()

//     countTasks()
// }

function removeTask(taskId, e) {
    deleteTask(taskId, jwt);    
    tasks = tasks.filter((task) => task.id !== parseInt(taskId))
    sessionStorage.setItem('tasks', JSON.stringify(tasks))
    const li = e.target.closest(`#li-${taskId}`);
    li.remove();
    
    countTasks()
}






// const listEl = document.querySelector('.todos');
// const doneList = document.querySelector('.completed');
// const logOutBtn = document.querySelector('.logout');
// const list = document.createElement("li");
// listEl.appendChild(list);
// const heartContainer = document.createElement('div');
// const taskId = document.createElement('span');

// taskId.classList.add('.id');
// holder.appendChild('taskId');
// heartContainer.classList.add('for-heart');
// const heartCheckBox = document.createElement("input");
// heartCheckBox.type = 'checkbox';
// heartCheckBox.classList.add('heart-checkbox');
// heartCheckBox.name = 'heart-checkbox';

// list.appendChild(heartContainer)
// heartContainer.appendChild(heartCheckBox)

// const holder = document.createElement('div');
// const descriptionSpan = document.createElement('span');
// descriptionSpan.classList.add('description');
// descriptionSpan.setAttribute("readonly", "readonly"); 

// const creationDateSpan = document.createElement('span');
// creationDateSpan.classList.add('creation-date');


// list.appendChild(holder)
// holder.appendChild(descriptionSpan)
// descriptionSpan.innerHTML = input.value;
// holder.appendChild(creationDateSpan)

// creationDateSpan.innerHTML = `<img width="11" height="12" src="./assets/calendar.svg"> :
// `

// const editTaskBtn = document.createElement('button');
// editTaskBtn.classList.add('edit-task');

// list.appendChild(editTaskBtn)
// editTaskBtn.innerHTML = `<img width="22" height="22" src="./assets/edit-btn.svg">`

// const removeTaskBtn = document.createElement('button');
// removeTaskBtn.classList.add('remove-task');

// list.appendChild(removeTaskBtn) 
// removeTaskBtn.innerHTML = `<img src="./assets/deleteTask.svg">`

// logOutBtn.addEventListener('click', logout);



// function createTaskCard(description, createdAt, completed, id) {
    


// function logout() {
//     sessionStorage.removeItem('jwt');
//     window.location.href = './index.html';  
// };

// function editTask(id) {   
//     editTaskBtn.addEventListener('click', async () => {
//         const descriptionSpan = document.querySelector(`#span-${id}`)
//         if (editTaskBtn.innerHTML == `<img width="22" height="22" src="./assets/edit-btn.svg">`) {
//             const data = await updateTask(jwt, {description: inputEditTask.value}, id); 
//             if (typeof data === 'object') {
//             descriptionSpan.removeAttribute("readonly");
//             descriptionSpan.setAttribute("contenteditable", "true");
//             descriptionSpan.focus();
//             editTaskBtn.innerHTML = `<img src="/assets/save-btn.svg">`
//             editTaskBtn.value = '';
//             } else {
//                 descriptionSpan.removeAttribute("contenteditable");
//                 descriptionSpan.setAttribute("readonly", "readonly");
//                 editTaskBtn.innerHTML = `<img width="22" height="22" src="./assets/edit-btn.svg">`
//             }
//         };

// async function removeTask(e) {
//       const id = document.querySelector('id-do-span').textContent;
//       const deletedTask = await deleteTask(id, jwt)
//       if (deletedTask === 200) {
//       e.target.closest(#div-${id}).remove();
// }
// }
   
//         const task = input.value;

//         if (!task) {
//             //insirer estado vazio aqui
//             alert("Please fill in the task")
//             return;
//         }
        
       
        
        // const doneTaskItem = document.createElement('li');
        // doneList.appendChild(doneTaskItem);

        // const doneTaskDiv = document.createElement('div');
        // doneTaskItem.appendChild(doneTaskDiv);

        // doneTaskDiv.innerHTML = `<img src="./assets/done-heart.svg" width="24" height="22">`

        // const spanTaskId = document.createElement('span');
        // spanTaskId.classList.add('id');

        // const spanDoneTaskDesc = document.createElement('span');
        // spanDoneTaskDesc.value = "ADICIONA CÓDIGO AQUI DEPOIS";

        // const spanDate = document.createElement('span');
        // spanDate.classList.add('completion-date');
        // spanDate.innerHTML = `<img width="11" height="12" src="./assets/calendar-white.svg"> : `

        // doneTaskDiv.appendChild(spanTaskId);
        // doneTaskDiv.appendChild(spanDoneTaskDesc);
        // doneTaskDiv.appendChild(spanDate);

        // const buttonsWrapper = document.createElement('div');
        // buttonsWrapper.classList.add('buttons-completed-tasks');
        // doneTaskDiv.appendChild(buttonsWrapper)

        // const redoBtn = document.createElement('button');
        // redoBtn.classList.add('redo-task');
        // redoBtn.innerHTML = `<img width="17" height="20" src="./assets/redo-btn.svg">`

        // buttonsWrapper.appendChild(redoBtn);

        // const deleteBtn = document.createElement('button');
        // deleteBtn.classList.add('remove-task');
        // deleteBtn.innerHTML = `<img width="21.16px" height="18.84" src="./assets/deleteTask.svg">`;

        // buttonsWrapper.appendChild(deleteBtn);

        // input.value = "";   


  
