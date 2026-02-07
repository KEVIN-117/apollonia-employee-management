// api.js - API Communication Layer
const API_BASE_URL = "http://localhost:3000/api/v1";

// ==========================================
// DEPARTMENTS API
// ==========================================

async function getDepartments() {
    try {
        const response = await fetch(`${API_BASE_URL}/departments`);
        if (!response.ok) throw new Error('Failed to fetch departments');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching departments:', error);
        showToast('Error al cargar departamentos', 'error');
        throw error;
    }
}

async function getDepartmentById(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/departments/${id}`);
        if (!response.ok) throw new Error('Failed to fetch department');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching department:', error);
        showToast('Error al cargar el departamento', 'error');
        throw error;
    }
}

async function createDepartment(department) {
    try {
        const response = await fetch(`${API_BASE_URL}/departments`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(department),
        });
        if (!response.ok) throw new Error('Failed to create department');
        const data = await response.json();
        showToast('Departamento creado exitosamente', 'success');
        return data;
    } catch (error) {
        console.error('Error creating department:', error);
        showToast('Error al crear el departamento', 'error');
        throw error;
    }
}

async function updateDepartment(id, department) {
    try {
        const response = await fetch(`${API_BASE_URL}/departments/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(department),
        });
        if (!response.ok) throw new Error('Failed to update department');
        const data = await response.json();
        showToast('Departamento actualizado exitosamente', 'success');
        return data;
    } catch (error) {
        console.error('Error updating department:', error);
        showToast('Error al actualizar el departamento', 'error');
        throw error;
    }
}

async function deleteDepartment(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/departments/${id}`, {
            method: "DELETE",
        });
        if (!response.ok) throw new Error('Failed to delete department');
        const data = await response.json();
        showToast('Departamento eliminado exitosamente', 'success');
        return data;
    } catch (error) {
        console.error('Error deleting department:', error);
        showToast('Error al eliminar el departamento', 'error');
        throw error;
    }
}

// ==========================================
// EMPLOYEES API
// ==========================================

async function getEmployees() {
    try {
        const response = await fetch(`${API_BASE_URL}/employees`);
        if (!response.ok) throw new Error('Failed to fetch employees');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching employees:', error);
        showToast('Error al cargar empleados', 'error');
        throw error;
    }
}

async function getEmployeeById(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/employees/${id}`);
        if (!response.ok) throw new Error('Failed to fetch employee');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching employee:', error);
        showToast('Error al cargar el empleado', 'error');
        throw error;
    }
}

async function createEmployee(employee) {
    try {
        const response = await fetch(`${API_BASE_URL}/employees`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(employee),
        });
        if (!response.ok) throw new Error('Failed to create employee');
        const data = await response.json();
        showToast('Empleado creado exitosamente', 'success');
        return data;
    } catch (error) {
        console.error('Error creating employee:', error);
        showToast('Error al crear el empleado', 'error');
        throw error;
    }
}

async function updateEmployee(id, employee) {
    try {
        const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(employee),
        });
        if (!response.ok) throw new Error('Failed to update employee');
        const data = await response.json();
        showToast('Empleado actualizado exitosamente', 'success');
        return data;
    } catch (error) {
        console.error('Error updating employee:', error);
        showToast('Error al actualizar el empleado', 'error');
        throw error;
    }
}

async function deleteEmployee(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
            method: "DELETE",
        });
        if (!response.ok) throw new Error('Failed to delete employee');
        const data = await response.json();
        showToast('Empleado eliminado exitosamente', 'success');
        return data;
    } catch (error) {
        console.error('Error deleting employee:', error);
        showToast('Error al eliminar el empleado', 'error');
        throw error;
    }
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const icons = {
        success: '<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--success-color)"><polyline points="20 6 9 17 4 12"></polyline></svg>',
        error: '<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--danger-color)"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>',
        info: '<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--info-color)"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>'
    };

    toast.innerHTML = `
        <div class="toast-icon">${icons[type] || icons.info}</div>
        <div class="toast-message">${message}</div>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}