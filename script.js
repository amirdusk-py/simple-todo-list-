let currentFilter = localStorage.getItem("taskFilter") || "all";

// Add Task
function addTask() {
    const input = document.getElementById("taskInput");
    const text = input.value.trim();
    if (!text) return;

    const taskDiv = document.createElement("div");
    taskDiv.className = "task";

    const span = document.createElement("span");
    span.textContent = text;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.addEventListener("change", () => {
        span.classList.toggle("done");
        saveTasks();
        applyFilter();
    });

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.addEventListener("click", () => editTask(taskDiv, span, editBtn));

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Remove";
    deleteBtn.addEventListener("click", () => {
        taskDiv.remove();
        saveTasks();
    });

    taskDiv.appendChild(span);
    taskDiv.appendChild(checkbox);
    taskDiv.appendChild(editBtn);
    taskDiv.appendChild(deleteBtn);

    document.getElementById("taskList").appendChild(taskDiv);
    input.value = "";
    saveTasks();
    applyFilter();
}

// Edit Task
function editTask(taskDiv, span, editBtn) {
    const input = document.createElement("input");
    input.type = "text";
    input.value = span.textContent;
    taskDiv.replaceChild(input, span);
    editBtn.textContent = "Save";

    editBtn.onclick = () => {
        if (input.value.trim()) span.textContent = input.value.trim();
        taskDiv.replaceChild(span, input);
        editBtn.textContent = "Edit";
        editBtn.onclick = () => editTask(taskDiv, span, editBtn);
        saveTasks();
    };
}

// Save / Load
function saveTasks() {
    const tasks = [];
    document.querySelectorAll(".task").forEach(t => {
        const span = t.querySelector("span");
        const done = span.classList.contains("done");
        tasks.push({ text: span.textContent, done });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function applyFilter() {
    const tasks = document.querySelectorAll(".task");
    tasks.forEach(task => {
        const span = task.querySelector("span");
        const done = span.classList.contains("done");
        const filter = currentFilter;
        task.style.display =
            filter === "all" ? "flex" :
            filter === "active" ? (done ? "none" : "flex") :
            (done ? "flex" : "none");
    });
    document.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("active"));
    document.querySelector(`.filter-btn[onclick="setFilter('${currentFilter}')"]`).classList.add("active");
}

// Filter buttons
function setFilter(f) {
    currentFilter = f;
    localStorage.setItem("taskFilter", f);
    applyFilter();
}

// Load tasks
window.onload = () => {
    const saved = JSON.parse(localStorage.getItem("tasks")) || [];
    saved.forEach(task => {
        document.getElementById("taskInput").value = task.text;
        addTask();
        const last = document.querySelector("#taskList .task:last-child span");
        const checkbox = document.querySelector("#taskList .task:last-child input[type='checkbox']");
        if (task.done) {
            last.classList.add("done");
            checkbox.checked = true;
        }
    });
    document.getElementById("taskInput").value = "";
    applyFilter();
};




