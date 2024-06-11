// for navigation part 

const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");

hamburger.addEventListener("click", mobileMenu);

function mobileMenu() {
  hamburger.classList.toggle("active");
  navMenu.classList.toggle("active");
}
const navLink = document.querySelectorAll(".nav-link");

navLink.forEach(n => n.addEventListener("click", closeMenu));

function closeMenu() {
  hamburger.classList.remove("active");
  navMenu.classList.remove("active");
}



// tasks page js code 

document.addEventListener("DOMContentLoaded", function() {
  const taskFormContainer = document.getElementById("taskFormContainer");
  const taskList = document.getElementById("taskList");
  let tasks = []; // Array to store tasks

  // Function to fetch tasks from dummy API
 function fetchTasks() {
   fetch("https://jsonplaceholder.typicode.com/todos")
     .then(response => response.json())
     .then(data => {
       tasks = data.slice(0, 5);
       tasks.forEach(task => {
         addTask({
           id: task.id,
           title: task.title,
           description: task.title,
           status: task.completed ? "done" : "todo",
           completed: task.completed
         });
       });
     })
     .catch(error => {
       console.error("Error fetching tasks:", error);
     });
 }

  // Function to add task form
  function addTaskForm() {
    const formHTML = `
            <form id="taskForm">
                <label for="taskTitle">Title:</label>
                <input type="text" id="taskTitle" required>
                <label for="taskDescription">Description:</label>
                <input type="text" id="taskDescription" required>
                <label for="taskStatus">Status:</label>
                <select id="taskStatus" required>
                    <option value="todo">To Do</option>
                    <option value="inprogress">In Progress</option>
                    <option value="done">Done</option>
                </select>
                <button type="submit" id="addTaskBtn">Add Task</button>
                <button type="button" id="updateTaskBtn" style="display: none;">Update Task</button>
                <button type="button" id="cancelEditBtn" style="display: none;">Cancel</button>
            </form>
        `;
    taskFormContainer.innerHTML = formHTML;

    // Add form submission event listener for adding and updating tasks
    const taskForm = document.getElementById("taskForm");
    taskForm.addEventListener("submit", function(e) {
      e.preventDefault();
      const taskTitle = document.getElementById("taskTitle").value;
      const taskDescription = document.getElementById("taskDescription").value;
      const taskStatus = document.getElementById("taskStatus").value;
      if (taskTitle.trim() !== "" && taskDescription.trim() !== "") {
        const taskId = Date.now(); // Generate unique ID for task
        const newTask = {
          id: taskId,
          title: taskTitle,
          description: taskDescription,
          status: taskStatus
        };
        addTask(newTask);
        taskForm.reset();
      } else {
        alert("Title and Description cannot be empty!");
      }
    });

    // Add event listener for canceling edit
    document
      .getElementById("cancelEditBtn")
      .addEventListener("click", function() {
        taskForm.reset();
        taskForm.removeAttribute("data-task-id");
        document.getElementById("addTaskBtn").style.display = "inline-block";
        document.getElementById("updateTaskBtn").style.display = "none";
        document.getElementById("cancelEditBtn").style.display = "none";
      });

    // Add event listener for updating task
    document
      .getElementById("updateTaskBtn")
      .addEventListener("click", function() {
        const taskId = taskForm.dataset.taskId;
        const taskTitle = document.getElementById("taskTitle").value;
        const taskDescription = document.getElementById("taskDescription")
          .value;
        const taskStatus = document.getElementById("taskStatus").value;
        if (taskTitle.trim() !== "" && taskDescription.trim() !== "") {
          updateTask(taskId, {
            title: taskTitle,
            description: taskDescription,
            status: taskStatus
          });
          taskForm.reset();
          taskForm.removeAttribute("data-task-id");
          document.getElementById("addTaskBtn").style.display = "inline-block";
          document.getElementById("updateTaskBtn").style.display = "none";
          document.getElementById("cancelEditBtn").style.display = "none";
        } else {
          alert("Title and Description cannot be empty!");
        }
      });
  }

  // function to search tasks 
  function search_task() {
    let input = document.getElementById("searchbar").value;
    input = input.toLowerCase();
    let x = document.getElementsByClassName("todo");

    for (i = 0; i < x.length; i++) {
      if (!x[i].innerHTML.toLowerCase().includes(input)) {
        x[i].style.display = "none";
      } else {
        x[i].style.display = "list-item";
      }
    }
  }

  // Function to add task to the list
  function addTask(task) {
    const li = document.createElement("li");
    li.textContent = `title: ${task.title} --> Description: ${task.description}`;
   li.classList.add(task.status);
   if (task.completed) {
     li.classList.add("completed");
   }
   li.dataset.taskId = task.id;

    // Add icons for updating/editing and deleting tasks
    const updateIcon = document.createElement("i");
    updateIcon.className = "fas fa-edit";
    updateIcon.style.marginRight = "20px"; // Add margin-right
    updateIcon.style.padding = "5px"; // Add padding
    updateIcon.addEventListener("click", function() {
      editTask(task.id, task.title, task.description, task.status);
    });
    li.appendChild(updateIcon);

    const deleteIcon = document.createElement("i");
    deleteIcon.className = "fas fa-trash-alt";
    deleteIcon.style.marginLeft = "10px"; // Add margin-right
    deleteIcon.style.padding = "5px"; // Add padding
    deleteIcon.addEventListener("click", function() {
      deleteTask(task.id);
    });
    li.appendChild(deleteIcon);

    taskList.appendChild(li);
  }

  // Function to edit task
 function editTask(taskId, title, description, status, completed) {
   const taskForm = document.getElementById("taskForm");
   taskForm.dataset.taskId = taskId;
   document.getElementById("taskTitle").value = title;
   document.getElementById("taskDescription").value = description;
   document.getElementById("taskStatus").value = status;
   document.getElementById("taskCompleted").checked = completed;
   document.getElementById("addTaskBtn").style.display = "none";
   document.getElementById("updateTaskBtn").style.display = "inline-block";
   document.getElementById("cancelEditBtn").style.display = "inline-block";
 }

  // Function to update task
  function updateTask(taskId, taskData) {
    const li = document.querySelector(`li[data-task-id="${taskId}"]`);
    li.textContent = `${taskData.title}: ${taskData.description}`;
    li.className = taskData.status;
    if (taskData.completed) {
      li.classList.add("completed");
    } else {
      li.classList.remove("completed");
    }
    // Find and reattach edit icon
    const editIcon = li.querySelector(".fa-edit");
    if (editIcon) {
      li.appendChild(editIcon);
    }

    // Find and reattach delete icon
    const deleteIcon = li.querySelector(".fa-trash-alt");
    if (deleteIcon) {
      li.appendChild(deleteIcon);
    }

    // In a real application, this would make a PATCH request to update task details
    // For this example, let's assume the update is successful
  }

  // Function to delete task
  function deleteTask(taskId) {
    const li = document.querySelector(`li[data-task-id="${taskId}"]`);
    li.remove();
    // In a real application, this would make a DELETE request to remove the task
    // For this example, let's assume the deletion is successful
  }

  // Initial add task form
  addTaskForm();
});



