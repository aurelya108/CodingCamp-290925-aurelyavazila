// Initialize todos array
let todos = [];
let currentFilter = 'all';

// Load todos when page loads
window.addEventListener('DOMContentLoaded', function() {
    loadTodos();
    renderTodo();
});

// Add new todo
function addTodo() {
    const todoInput = document.getElementById('todo-input');
    const todoDate = document.getElementById('todo-date');
    
    // Validate input
    if (validateInput(todoInput.value, todoDate.value)) {
        // Create new todo object
        const newTodo = {
            id: Date.now(),
            task: todoInput.value.trim(),
            date: todoDate.value,
            completed: false
        };
        
        // Add to array
        todos.push(newTodo);
        
        // Save to localStorage
        saveTodos();
        
        // Render updated list
        renderTodo();
        
        // Clear inputs
        todoInput.value = '';
        todoDate.value = '';
        todoInput.focus();
    }
}

// Render todo list
function renderTodo() {
    const todoList = document.getElementById('todo-list');
    const emptyState = document.getElementById('empty-state');
    
    // Filter todos based on current filter
    let filteredTodos = todos;
    if (currentFilter === 'active') {
        filteredTodos = todos.filter(t => !t.completed);
    } else if (currentFilter === 'completed') {
        filteredTodos = todos.filter(t => t.completed);
    }
    
    // Clear list
    todoList.innerHTML = '';
    
    // Show empty state if no todos
    if (filteredTodos.length === 0) {
        emptyState.classList.remove('hidden');
        return;
    } else {
        emptyState.classList.add('hidden');
    }
    
    // Render each todo
    filteredTodos.forEach((todo) => {
        const li = document.createElement('li');
        li.className = 'todo-item' + (todo.completed ? ' completed' : '');
        
        const formattedDate = formatDate(todo.date);
        
        li.innerHTML = `
            <input 
                type="checkbox" 
                class="todo-checkbox"
                ${todo.completed ? 'checked' : ''}
                onchange="toggleTodo(${todo.id})"
            />
            <div class="todo-content">
                <div class="todo-text">${escapeHtml(todo.task)}</div>
                <div class="todo-date">📅 ${formattedDate}</div>
            </div>
            <button class="btn-delete" onclick="deleteTodo(${todo.id})">
                Delete
            </button>
        `;
        
        todoList.appendChild(li);
    });
}

// Toggle todo completion
function toggleTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        saveTodos();
        renderTodo();
    }
}

// Delete single todo
function deleteTodo(id) {
    if (confirm('Are you sure you want to delete this task?')) {
        todos = todos.filter(t => t.id !== id);
        saveTodos();
        renderTodo();
    }
}

// Delete all todos
function deleteAllTodo() {
    if (todos.length === 0) {
        alert('No tasks to delete');
        return;
    }
    
    if (confirm('Are you sure you want to delete ALL tasks?')) {
        todos = [];
        saveTodos();
        renderTodo();
    }
}

// Filter todos
function filterTodos(filter) {
    currentFilter = filter;
    
    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const filterMap = {
        'all': 'filterAll',
        'active': 'filterActive',
        'completed': 'filterCompleted'
    };
    
    document.getElementById(filterMap[filter]).classList.add('active');
    
    renderTodo();
}

// Validate input
function validateInput(task, date) {
    // Check if task is empty
    if (task === '' || task.trim() === '') {
        alert('⚠️ Task can not be empty!');
        return false;
    }
    
    // Check if date is empty
    if (date === '') {
        alert('⚠️ Date can not be empty!');
        return false;
    }
    
    return true;
}

// Format date to Indonesian
function formatDate(dateString) {
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('id-ID', options);
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Save todos to localStorage
function saveTodos() {
    try {
        localStorage.setItem('todos', JSON.stringify(todos));
    } catch (e) {
        console.error('Error saving to localStorage:', e);
    }
}

// Load todos from localStorage
function loadTodos() {
    try {
        const savedTodos = localStorage.getItem('todos');
        if (savedTodos) {
            todos = JSON.parse(savedTodos);
        }
    } catch (e) {
        console.error('Error loading from localStorage:', e);
        todos = [];
    }
}

// Add Enter key support
document.addEventListener('DOMContentLoaded', function() {
    const todoInput = document.getElementById('todo-input');
    const todoDate = document.getElementById('todo-date');
    
    todoInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTodo();
        }
    });
    
    todoDate.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTodo();
        }
    });
});
