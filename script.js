
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let editIndex = null;
let currentFilter = "all";

const form = document.getElementById("taskForm");
const titleInput = document.getElementById("title");
const dateInput = document.getElementById("date");
const timeInput = document.getElementById("time");
const descInput = document.getElementById("description");
const taskList = document.getElementById("taskList"); // Nome ajustado para consistência

form.addEventListener("submit", function (e) {
    e.preventDefault();

    const task = {
        title: titleInput.value,
        date: dateInput.value,
        time: timeInput.value,
        description: descInput.value,
        done: false
    };

    if (editIndex === null) {
        tasks.push(task); // Corrigido: push na array 'tasks'
    } else {
        task.done = tasks[editIndex].done;
        tasks[editIndex] = task;
        editIndex = null; // Corrigido: erro de digitação (Z -> X)
    }

    saveTasks();
    form.reset();
    renderTasks();
});

function renderTasks() {
    taskList.innerHTML = ""; // Corrigido: usando a variável correta

    let filtered = tasks.filter(task => { // Corrigido: syntax do arrow function
        if (currentFilter === "pending") return !task.done;
        if (currentFilter === "done") return task.done;
        return true;
    });

    filtered.forEach((task, index) => {
        const card = document.createElement("div");
        card.classList.add("task-card");

        if (task.done) card.classList.add("done");

        card.innerHTML = `
        <h3>${task.title}</h3>
        <p>${task.date} às ${task.time}</p>
        <p>${task.description}</p>

        <div class="actions">
            <button onclick="toggleDone(${index})">${task.done ? 'Refazer' : 'Concluir'}</button>
            <button onclick="editTask(${index})">Editar</button>
            <button onclick="deleteTask(${index})">Excluir</button>
        </div>
        `;

        taskList.appendChild(card);
    });
}

function toggleDone(index) {
    tasks[index].done = !tasks[index].done;
    saveTasks();
    renderTasks();
}

function editTask(index) {
    const task = tasks[index];

    titleInput.value = task.title;
    dateInput.value = task.date;
    timeInput.value = task.time;
    descInput.value = task.description;

    editIndex = index;
}

function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
}

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Filtros corrigidos
document.querySelectorAll("[data-filter]").forEach(button => {
    button.addEventListener("click", () => {
        currentFilter = button.dataset.filter; // Corrigido: usando .dataset
        renderTasks();
    });
});

renderTasks();