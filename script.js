
const input = document.getElementById("value");
const list = document.getElementById('list');
const form = document.getElementById('myForm');

form.addEventListener('submit' , function(event){ // the event listener when submit the form
    event.preventDefault()
    if (input.value === ''){ // if its empty
    alert('Please enter a task!');
    return;
}
    const v = input.value;
    addTask(v)
    
    return input.value = '';
})

function addTask(value , taskDone = false){
    // this all to make three spans span3 for checkbox span2 for edit and delete buttons, span 1 for the value all in list item (li)
    const span1 = document.createElement('span');
    const span2 = document.createElement('span');
    const span3 = document.createElement('span')
    span1.className = 'or'
    span2.className = 'ord';
    span3.className = 'ched';
    const li = document.createElement('li');
    const deletebtn = document.createElement('button');
    const editbtn = document.createElement('button'); 
    const checkBox = document.createElement('input');
    editbtn.innerHTML = 'edit';
    editbtn.id = 'edit';
    deletebtn.innerHTML = 'X';
    checkBox.type = 'checkbox';
    checkBox.className = 'checks';
    /////////////
    // to save the checbox actions to local storage
    checkBox.checked = taskDone;
    if (taskDone) {
        span1.style.textDecoration = 'line-through';
        li.classList.add('completed');
    }
    checkBox.onclick = () =>{ 
        span1.style.textDecoration = checkBox.checked ? 'line-through' : 'none';
        saveTasksToLocalStorage();
    } ;
    ///////////////
    list.appendChild(li);
    //span1 and two inside li
    li.appendChild(span3);
    li.appendChild(span1);
    li.appendChild(span2);
    //editbtn and deletebtn inside span2
    span2.appendChild(editbtn);
    span2.appendChild(deletebtn);
    span3.appendChild(checkBox)
    deletebtn.className = 'closebtn';
    deletebtn.onclick = function(){ li.remove() };
    editbtn.onclick = function(){ edits(li , span1 , span3 , editbtn )};
    span1.innerHTML = value;
    
    saveTasksToLocalStorage()//to save actions to local storage 
    showNotification(value)
}


// this function to edit the value


function edits(li , span1 , span3 , editbtn) {
    const isEditing = li.classList.contains('editing') // to add editing class to save the new value
    if (isEditing) {
        span1.innerHTML = li.querySelector('input').value; // select the value of the input
        li.removeChild(li.querySelector('input')); // to remove the input after edited
        li.classList.remove('editing');// remove the class
        editbtn.innerHTML = 'edited'; // set diffrent name to check if the value changeed
        li.appendChild(span3);
        span1.className = 'or';
    } else{
        const inpust = document.createElement('input');
        inpust.className = 'changeinput';
        inpust.type = 'text';
        inpust.value = span1.innerHTML; // to get the value of the new input
        li.insertBefore(inpust, span1); // to replace the value of new input to the span 3
        li.classList.add('editing'); // to save it
        span1.className='no';// set the class to disable with css the previous value when editing
        li.removeChild(span3)
        editbtn.innerHTML = 'Save'; //the button value turns when editing
    }
    saveTasksToLocalStorage() //for each action with editing saved to local storage
}




let permission = Notification.permission;

if(permission === "granted"){
   showNotification();
} else if(permission === "default"){
   requestAndShowPermission();
} else {
  alert("Use normal alert");
}

function requestAndShowPermission() {
    Notification.requestPermission(function (permission) {
        if (permission === "granted") {
            showNotification();
        }
    });
}
function showNotification(tasktext) {
let title = "Task Added";
let body = `ya have added " ${tasktext} " `;

let notification = new Notification(title, { body });

notification.onclick = () => {
    notification.close();
    window.parent.focus();
}
}







// this function to save it to local storage



function saveTasksToLocalStorage() {
    const tasks = []; // add an array
    document.querySelectorAll('#list li').forEach(task => {  // call list li to save each list item  
        const taskText = task.querySelector('.or').innerHTML; // save the value in list item
        const taskDone = task.querySelector('.checks').checked; // to save checkbox actions
        const isCompleted = task.classList.contains('completed'); // add a class to function i want to save
        tasks.push({ text: taskText , done: taskDone , completed: isCompleted}); // to push all in the arrary to save it to local storage
    });
    localStorage.setItem('tasks', JSON.stringify(tasks)); // when i want to save first i must to set it so i set it witn array as json
    console.log('saved' , tasks);
}

document.addEventListener('DOMContentLoaded', function() { // after set item i get item to then i save each addTask clicks 
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    savedTasks.forEach(task => {
        addTask(task.text ,task.done);
    });
});