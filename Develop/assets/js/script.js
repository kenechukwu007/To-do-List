// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));
//const dateInputEl = $('#datepicker');

// Todo: create a function to generate a unique task id
function generateTaskId() {
    return nextId++;

}

// Todo: create a function to create a task card
function createTaskCard(task) {
    const laneId =  task.status.toLowerCase();

    console.log(laneId);
    const laneCardContainer = document.getElementById("todo-cards");
    console.log(laneCardContainer);


    if (!laneCardContainer) {
        console.error(`Lane cards container not found for lane with ID: ${laneId}`);
        return; // Exit the function if container is not found
    }

    const taskCard = document.createElement('div');
    taskCard.classList.add('card', 'border-light', 'mb-3', 'task-card');
    taskCard.dataset.taskId = task.id;

    const cardHeader =  document.createElement('div');
    cardHeader.classList.add('card-header', 'bg-white');
    cardHeader.innerHTML = `<h4 class="card-title mb-0">${task.name}</h4>`;
    taskCard.appendChild(cardHeader);

    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body', 'bg-light');
    cardBody.innerHTML = `<p class="card-text">${task.description}</p>`;
    taskCard.appendChild(cardBody);


    laneCardContainer.appendChild(taskCard);

}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    if (!Array.isArray(taskList)) {
        // Initialize taskList as an empty array
        taskList = [];
    }

    taskList.forEach(task => {
        createTaskCard(task); // Assuming createTaskCard function is defined
        makeCardDraggable(task.id); // Make the card draggable
    });
}

// Make task cards draggable using jQuery UI
function makeCardDraggable(taskId) {
    $(`#task-${taskId}`).draggable({
        containment: '.container', // Limit dragging within the container
        stack: '.task-card', // Ensure that draggable cards stack on top of each other
        revert: 'invalid', // Return the card to its original position if dropped outside droppable area
        cursor: 'move', // Set cursor style to indicate draggable element
        helper: 'clone', // Display a clone of the card while dragging
        scroll: false // Disable scrolling while dragging
    });
}


// Todo: create a function to handle adding a new task
function handleAddTask(event){
    event.preventDefault(); // Prevent form submission and page reload

    // Retrieve task details from the input fields or modal form
    const taskName = $('#taskName').val();
    const taskDescription = $('#taskDescription').val();
    const dateInputEl = $('#datepicker').val(); 

    taskList = taskList || [];
    // Create a new task object
    const newTask = {
        id: generateTaskId(),
        name: taskName,
        description: taskDescription,
        dueDate: dateInputEl,
        status: 'To Do' // Assuming new tasks are initially in the "To Do" status
    };

    // Add the new task to the task list
    taskList.push(newTask);

    // Render the updated task list
    renderTaskList();

}

$('#taskForm').submit(handleAddTask);

// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {
    const taskId = event.target.dataset.taskId; // Assuming you have a data-task-id attribute on the task card's delete button

    // Find the index of the task with the matching ID in the taskList array
    const taskIndex = taskList.findIndex(task => task.id === parseInt(taskId));

    if (taskIndex !== -1) {
        // Remove the task from the taskList array
        taskList.splice(taskIndex, 1);

        // Remove the corresponding task card from the DOM
        const taskCard = document.getElementById(`task-${taskId}`);
        if (taskCard) {
            taskCard.remove();
        }

        // Save the updated taskList to localStorage
        saveTasksToLocalStorage();
    } else {
        console.error(`Task with ID ${taskId} not found.`);
    }
}

function handleDrop(event, ui) {
    const taskId = ui.draggable.attr(event); // Get the task ID from the draggable task card
    const newLaneId = $(event).attr('id'); // Get the ID of the status lane where the task is dropped

    if (!Array.isArray(taskList)) {
        // Initialize taskList as an empty array
        taskList = [];
    }

    // Update the status of the task in the taskList array
    const taskIndex = taskList.findIndex(task => task.id === parseInt(taskId));
    if (taskIndex !== -1) {
        taskList[taskIndex].status = newLaneId; // Update the status of the task
        renderTaskList(); // Re-render the task list to reflect the updated status
        saveTasksToLocalStorage(); // Save the updated task list to localStorage
    } else {
        console.error(`Task with ID ${taskId} not found.`);
    }
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    // Render the task list
    renderTaskList();

    // Add event listeners
    $('#add-task-form').submit(handleAddTask); // Assuming you have a form for adding tasks
    $('.delete-task-btn').click(handleDeleteTask); // Assuming you have delete buttons for tasks
    $('#todo-cards').draggable();
    $('#in-progress-cards').draggable();
    $('#done-cards').draggable(); // Make task cards draggable

    // Make lanes droppable
    $('#to-do').droppable({
        drop: handleDrop // Assuming you have a handleDrop function to handle dropping tasks into lanes
    });

    $('#in-progress').droppable({
        drop: handleDrop // Assuming you have a handleDrop function to handle dropping tasks into lanes
    });

    $('#done').droppable({
        drop: handleDrop // Assuming you have a handleDrop function to handle dropping tasks into lanes
    });

    // Make the due date field a date picker
    $('#datepicker').datepicker({
        dateFormat: 'yy-mm-dd', // Set the date format
        minDate: 0, // Set minimum selectable date to today
        changeMonth: true, // Allow changing month
        changeYear: true // Allow changing year
    });
});
