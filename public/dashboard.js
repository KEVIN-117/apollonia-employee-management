// dashboard.js - Main Application Logic

// State Management
let currentView = 'overview';
let departments = [];
let employees = [];
let currentEditId = null;
let currentEditType = null;

// DOM Elements
const mainContent = document.getElementById('main-content');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.getElementById('modal-body');
const modalClose = document.querySelector('.modal-close');
const pageTitle = document.querySelector('.page-title');
const menuToggle = document.querySelector('.menu-toggle');
const sidebar = document.querySelector('.sidebar');
let navItems = document.querySelectorAll('.nav-item');

// ==========================================
// INITIALIZATION
// ==========================================

document.addEventListener('DOMContentLoaded', async () => {
    await loadData();
    renderSidebar();
    renderView('overview');
    initializeEventListeners();
});


function renderSidebar() {
    const sidebar = document.querySelector('.sidebar-nav');
    sidebar.innerHTML = '';
    sidebarItems.forEach(item => {
        const btn = document.createElement('button');
        btn.className = `nav-item ${item.view === currentView ? 'active' : ''}`;
        btn.dataset.view = item.view;
        btn.innerHTML = `
            ${item.icon}
            <span>${item.name}</span>
        `;
        const divider = document.createElement('div');
        divider.className = 'nav-divider';
        sidebar.appendChild(btn);
        sidebar.appendChild(divider);
    });
}

async function loadData() {
    try {
        [departments, employees] = await Promise.all([
            getDepartments(),
            getEmployees()
        ]);
    } catch (error) {
        console.error('Error loading initial data:', error);
    }
}

function initializeEventListeners() {
    // Navigation
    navItems = document.querySelectorAll('.nav-item')
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const view = item.dataset.view;
            setActiveNav(item);
            renderView(view);
        });
    });

    // Modal close
    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Mobile menu toggle
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }

    // Search functionality
    const searchInput = document.querySelector('.search-box input');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }
}

function setActiveNav(activeItem) {
    navItems.forEach(item => item.classList.remove('active'));
    activeItem.classList.add('active');
}

// ==========================================
// VIEW RENDERING
// ==========================================

async function renderView(view) {
    currentView = view;

    const titles = {
        overview: 'Dashboard',
        employees: 'Empleados',
        departments: 'Departamentos',
        analytics: 'Analíticas',
        settings: 'Configuración'
    };

    pageTitle.textContent = titles[view] || 'Dashboard';

    switch (view) {
        case 'overview':
            renderOverview();
            break;
        case 'employees':
            await loadData();
            renderEmployees();
            break;
        case 'departments':
            await loadData();
            renderDepartments();
            break;
        case 'analytics':
            renderAnalytics();
            break;
        case 'settings':
            renderSettings();
            break;
        default:
            renderOverview();
    }
}

// ==========================================
// OVERVIEW VIEW
// ==========================================

function renderOverview() {
    const totalEmployees = employees.length;
    const totalDepartments = departments.length;
    const avgEmployeesPerDept = departments.length > 0
        ? Math.round(totalEmployees / totalDepartments)
        : 0;

    mainContent.innerHTML = `
        <div class="fade-in">
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-header">
                        <span class="stat-label">Total Empleados</span>
                        <div class="stat-icon">
                            ${icons.users}
                        </div>
                    </div>
                    <div class="stat-value">${totalEmployees}</div>
                    <div class="stat-change positive">
                        ${icons.chevron_up}
                        Activos
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-header">
                        <span class="stat-label">Departamentos</span>
                        <div class="stat-icon">
                            ${icons.house}
                        </div>
                    </div>
                    <div class="stat-value">${totalDepartments}</div>
                    <div class="stat-change positive">
                        ${icons.chevron_up}
                        Operativos
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-header">
                        <span class="stat-label">Promedio por Dept.</span>
                        <div class="stat-icon">
                            ${icons.analytics}
                        </div>
                    </div>
                    <div class="stat-value">${avgEmployeesPerDept}</div>
                    <div class="stat-change">
                        Empleados/Dept.
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-header">
                        <span class="stat-label">Estado Sistema</span>
                        <div class="stat-icon">
                            ${icons.clock}
                        </div>
                    </div>
                    <div class="stat-value">100%</div>
                    <div class="stat-change positive">
                        ${icons.chevron_up}
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        Operativo
                    </div>
                </div>
            </div>

            <div class="section">
                <div class="section-header">
                    <h2 class="section-title">Resumen de Departamentos</h2>
                    <button class="btn btn-primary" onclick="renderView('departments')">
                        Ver Todos
                        ${icons.chevron_right}
                    </button>
                </div>
                ${renderDepartmentsSummary()}
            </div>

            <div class="section">
                <div class="section-header">
                    <h2 class="section-title">Empleados Recientes</h2>
                    <button class="btn btn-primary" onclick="renderView('employees')">
                        Ver Todos
                        ${icons.chevron_right}
                    </button>
                </div>
                ${renderEmployeesSummary()}
            </div>
        </div>
    `;
}

function renderDepartmentsSummary() {
    if (departments.length === 0) {
        return `
            <div class="empty-state">
                <div class="empty-state-icon">
                    ${icons.house}
                </div>
                <h3>No hay departamentos</h3>
                <p>Comienza creando tu primer departamento</p>
            </div>
        `;
    }

    const topDepartments = departments.slice(0, 4);
    const cards = topDepartments.map(dept => {
        const employeeCount = employees.filter(emp => emp.department === dept._id).length;
        return `
            <div class="stat-card">
                <div class="stat-header">
                    <span class="stat-label">${dept.name}</span>
                    <span class="badge badge-primary">${employeeCount} empleados</span>
                </div>
                <div style="margin-top: 16px;">
                    <button class="btn btn-sm btn-outline" onclick="viewDepartmentDetails('${dept._id}')">
                        Ver Detalles
                    </button>
                </div>
            </div>
        `;
    }).join('');

    return `<div class="stats-grid">${cards}</div>`;
}

function renderEmployeesSummary() {
    if (employees.length === 0) {
        return `
            <div class="empty-state">
                <div class="empty-state-icon">
                    ${icons.users}
                </div>
                <h3>No hay empleados</h3>
                <p>Comienza agregando tu primer empleado</p>
            </div>
        `;
    }

    const recentEmployees = employees.slice(0, 5);
    const rows = recentEmployees.map(emp => {
        const dept = departments.find(d => d._id === emp.department);
        return `
            <tr>
                <td><strong>${emp.firstName} ${emp.lastName}</strong></td>
                <td><span class="badge badge-primary">${dept ? dept.name : 'Sin departamento'}</span></td>
                <td>
                    <button class="btn btn-sm btn-outline" onclick="editEmployee('${emp._id}')">
                        Ver Perfil
                    </button>
                </td>
            </tr>
        `;
    }).join('');

    return `
        <div class="data-table-wrapper">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Departamento</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows}
                </tbody>
            </table>
        </div>
    `;
}

// ==========================================
// EMPLOYEES VIEW
// ==========================================

function renderEmployees() {
    if (employees.length === 0) {
        mainContent.innerHTML = `
            <div class="fade-in">
                <div class="section-header">
                    <h2 class="section-title">Empleados</h2>
                    <button class="btn btn-primary" onclick="openCreateEmployeeModal()">
                        ${icons.plus}
                        Nuevo Empleado
                    </button>
                </div>
                <div class="empty-state">
                    <div class="empty-state-icon">
                        ${icons.users}
                    </div>
                    <h3>No hay empleados registrados</h3>
                    <p>Comienza agregando tu primer empleado al sistema</p>
                    <button class="btn btn-primary" onclick="openCreateEmployeeModal()" style="margin-top: 20px;">
                        ${icons.plus}
                        Crear Primer Empleado
                    </button>
                </div>
            </div>
        `;
        return;
    }

    const rows = employees.map(emp => {
        const dept = departments.find(d => d._id === emp.department);
        return `
            <tr>
                <td>
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div class="user-avatar" style="width: 36px; height: 36px; font-size: 0.85rem;">
                            ${emp.firstName.charAt(0)}${emp.lastName.charAt(0)}
                        </div>
                        <strong>${emp.firstName} ${emp.lastName}</strong>
                    </div>
                </td>
                <td><span class="badge badge-primary">${dept ? dept.name : 'Sin asignar'}</span></td>
                <td>${new Date().toLocaleDateString()}</td>
                <td>
                    <div class="table-actions">
                        <button class="action-btn" onclick="editEmployee('${emp._id}')" title="Editar">
                            ${icons.edit}
                        </button>
                        <button class="action-btn delete" onclick="confirmDeleteEmployee('${emp._id}')" title="Eliminar">
                            ${icons.delete}
                        </button>
                    </div>
                            </svg>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');

    mainContent.innerHTML = `
        <div class="fade-in">
            <div class="section-header">
                <h2 class="section-title">Empleados (${employees.length})</h2>
                <button class="btn btn-primary" onclick="openCreateEmployeeModal()">
                    ${icons.plus}
                    Nuevo Empleado
                </button>
            </div>

            <div class="data-table-wrapper">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Nombre Completo</th>
                            <th>Departamento</th>
                            <th>Fecha de Registro</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rows}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

// ==========================================
// DEPARTMENTS VIEW
// ==========================================

function renderDepartments() {
    if (departments.length === 0) {
        mainContent.innerHTML = `
            <div class="fade-in">
                <div class="section-header">
                    <h2 class="section-title">Departamentos</h2>
                    <button class="btn btn-primary" onclick="openCreateDepartmentModal()">
                        ${icons.plus}
                        Nuevo Departamento
                    </button>
                </div>
                <div class="empty-state">
                    <div class="empty-state-icon">
                        ${icons.house}
                    </div>
                    <h3>No hay departamentos registrados</h3>
                    <p>Comienza creando tu primer departamento</p>
                    <button class="btn btn-primary" onclick="openCreateDepartmentModal()" style="margin-top: 20px;">
                        ${icons.plus}
                        Crear Primer Departamento
                    </button>
                </div>
            </div>
        `;
        return;
    }

    const cards = departments.map(dept => {
        const employeeCount = employees.filter(emp => emp.department === dept._id).length;
        const employeesList = employees
            .filter(emp => emp.department === dept._id)
            .slice(0, 3)
            .map(emp => `${emp.firstName} ${emp.lastName}`)
            .join(', ');

        return `
            <div class="stat-card">
                <div class="stat-header">
                    <span class="stat-label">${dept.name}</span>
                    <span class="badge badge-success">${employeeCount} empleados</span>
                </div>
                <div style="margin-top: 16px; color: var(--text-muted); font-size: 0.9rem; min-height: 40px;">
                    ${employeesList || 'Sin empleados asignados'}
                    ${employeeCount > 3 ? ` y ${employeeCount - 3} más...` : ''}
                </div>
                <div style="margin-top: 20px; display: flex; gap: 8px; justify-content: flex-end;">
                    <button class="btn btn-sm btn-outline" onclick="editDepartment('${dept._id}')">
                        ${icons.edit}
                        Editar
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="confirmDeleteDepartment('${dept._id}')">
                        ${icons.delete}
                        Eliminar
                    </button>
                </div>
            </div>
        `;
    }).join('');

    mainContent.innerHTML = `
        <div class="fade-in">
            <div class="section-header">
                <h2 class="section-title">Departamentos (${departments.length})</h2>
                <button class="btn btn-primary" onclick="openCreateDepartmentModal()">
                    ${icons.plus}
                    Nuevo Departamento
                </button>
            </div>

            <div class="stats-grid">
                ${cards}
            </div>
        </div>
    `;
}

// ==========================================
// ANALYTICS VIEW
// ==========================================

function renderAnalytics() {
    const departmentStats = departments.map(dept => {
        const count = employees.filter(emp => emp.department === dept._id).length;
        return { name: dept.name, count };
    }).sort((a, b) => b.count - a.count);

    const statsRows = departmentStats.map((stat, index) => `
        <tr>
            <td><strong>#${index + 1}</strong></td>
            <td>${stat.name}</td>
            <td>
                <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="flex: 1; height: 8px; background: var(--bg-hover); border-radius: 4px; overflow: hidden;">
                        <div style="width: ${stat.count * 20}%; height: 100%; background: linear-gradient(90deg, var(--accent-color), var(--mint-accent));"></div>
                    </div>
                    <strong style="min-width: 40px;">${stat.count}</strong>
                </div>
            </td>
        </tr>
    `).join('');

    mainContent.innerHTML = `
        <div class="fade-in">
            <div class="stats-grid" style="margin-bottom: 32px;">
                <div class="stat-card">
                    <div class="stat-label">Ratio Empleados/Dept.</div>
                    <div class="stat-value">${departments.length > 0 ? (employees.length / departments.length).toFixed(1) : 0}</div>
                    <p style="color: var(--text-muted); font-size: 0.9rem; margin-top: 8px;">Promedio de empleados</p>
                </div>

                <div class="stat-card">
                    <div class="stat-label">Departamento Más Grande</div>
                    <div class="stat-value">${departmentStats.length > 0 ? departmentStats[0].count : 0}</div>
                    <p style="color: var(--text-muted); font-size: 0.9rem; margin-top: 8px;">${departmentStats.length > 0 ? departmentStats[0].name : 'N/A'}</p>
                </div>

                <div class="stat-card">
                    <div class="stat-label">Tasa de Ocupación</div>
                    <div class="stat-value">${departments.length > 0 ? Math.round((employees.length / (departments.length * 10)) * 100) : 0}%</div>
                    <p style="color: var(--text-muted); font-size: 0.9rem; margin-top: 8px;">Capacidad utilizada</p>
                </div>
            </div>

            <div class="section">
                <div class="section-header">
                    <h2 class="section-title">Distribución por Departamento</h2>
                </div>
                <div class="data-table-wrapper">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Ranking</th>
                                <th>Departamento</th>
                                <th>Empleados</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${statsRows || '<tr><td colspan="3" style="text-align: center; padding: 40px;">No hay datos disponibles</td></tr>'}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

// ==========================================
// SETTINGS VIEW
// ==========================================

function renderSettings() {
    mainContent.innerHTML = `
        <div class="fade-in">
            <div class="section">
                <div class="section-header">
                    <h2 class="section-title">Configuración del Sistema</h2>
                </div>

                <div class="stat-card" style="margin-bottom: 20px;">
                    <h3 style="margin-bottom: 16px; color: var(--text-primary);">Conexión API</h3>
                    <p style="color: var(--text-muted); margin-bottom: 12px;">URL Base: <strong style="color: var(--accent-color);">http://localhost:3000/api/v1</strong></p>
                    <span class="badge badge-success">Conectado</span>
                </div>

                <div class="stat-card" style="margin-bottom: 20px;">
                    <h3 style="margin-bottom: 16px; color: var(--text-primary);">Estadísticas del Sistema</h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
                        <div>
                            <p style="color: var(--text-muted); font-size: 0.9rem;">Total Empleados</p>
                            <p style="font-size: 1.5rem; font-weight: 700; color: var(--accent-color);">${employees.length}</p>
                        </div>
                        <div>
                            <p style="color: var(--text-muted); font-size: 0.9rem;">Total Departamentos</p>
                            <p style="font-size: 1.5rem; font-weight: 700; color: var(--mint-accent);">${departments.length}</p>
                        </div>
                        <div>
                            <p style="color: var(--text-muted); font-size: 0.9rem;">Última Actualización</p>
                            <p style="font-size: 1rem; font-weight: 600; color: var(--text-primary);">${new Date().toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                <div class="stat-card">
                    <h3 style="margin-bottom: 16px; color: var(--text-primary);">Acciones del Sistema</h3>
                    <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                        <button class="btn btn-primary" onclick="loadData(); renderView(currentView);">
                            ${icons.refresh}
                            Recargar Datos
                        </button>
                        <button class="btn btn-secondary" onclick="exportData()">
                            ${icons.export}
                            Exportar Datos
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// ==========================================
// MODAL FUNCTIONS
// ==========================================

function openCreateEmployeeModal() {
    currentEditId = null;
    currentEditType = 'employee';
    modalTitle.textContent = 'Nuevo Empleado';

    const departmentOptions = departments.map(dept =>
        `<option value="${dept._id}">${dept.name}</option>`
    ).join('');

    modalBody.innerHTML = `
        <form id="employee-form" onsubmit="handleEmployeeSubmit(event)">
            <div class="form-group">
                <label class="form-label">Nombre</label>
                <input type="text" class="form-input" name="firstName" required>
            </div>
            <div class="form-group">
                <label class="form-label">Apellido</label>
                <input type="text" class="form-input" name="lastName" required>
            </div>
            <div class="form-group">
                <label class="form-label">Departamento</label>
                <select class="form-select" name="department" required>
                    <option value="">Selecciona un departamento</option>
                    ${departmentOptions}
                </select>
            </div>
            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
                <button type="submit" class="btn btn-primary">Crear Empleado</button>
            </div>
        </form>
    `;

    modal.classList.add('active');
}

async function editEmployee(id) {
    currentEditId = id;
    currentEditType = 'employee';

    try {
        const employee = await getEmployeeById(id);
        modalTitle.textContent = 'Editar Empleado';

        const departmentOptions = departments.map(dept =>
            `<option value="${dept._id}" ${dept._id === employee.department ? 'selected' : ''}>${dept.name}</option>`
        ).join('');

        modalBody.innerHTML = `
            <form id="employee-form" onsubmit="handleEmployeeSubmit(event)">
                <div class="form-group">
                    <label class="form-label">Nombre</label>
                    <input type="text" class="form-input" name="firstName" value="${employee.firstName}" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Apellido</label>
                    <input type="text" class="form-input" name="lastName" value="${employee.lastName}" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Departamento</label>
                    <select class="form-select" name="department" required>
                        <option value="">Selecciona un departamento</option>
                        ${departmentOptions}
                    </select>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
                    <button type="submit" class="btn btn-primary">Guardar Cambios</button>
                </div>
            </form>
        `;

        modal.classList.add('active');
    } catch (error) {
        console.error('Error loading employee:', error);
    }
}

function openCreateDepartmentModal() {
    currentEditId = null;
    currentEditType = 'department';
    modalTitle.textContent = 'Nuevo Departamento';

    modalBody.innerHTML = `
        <form id="department-form" onsubmit="handleDepartmentSubmit(event)">
            <div class="form-group">
                <label class="form-label">Nombre del Departamento</label>
                <input type="text" class="form-input" name="name" placeholder="Ej: Odontología General" required>
            </div>
            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
                <button type="submit" class="btn btn-primary">Crear Departamento</button>
            </div>
        </form>
    `;

    modal.classList.add('active');
}

async function editDepartment(id) {
    currentEditId = id;
    currentEditType = 'department';

    try {
        const department = await getDepartmentById(id);
        modalTitle.textContent = 'Editar Departamento';

        modalBody.innerHTML = `
            <form id="department-form" onsubmit="handleDepartmentSubmit(event)">
                <div class="form-group">
                    <label class="form-label">Nombre del Departamento</label>
                    <input type="text" class="form-input" name="name" value="${department.name}" required>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
                    <button type="submit" class="btn btn-primary">Guardar Cambios</button>
                </div>
            </form>
        `;

        modal.classList.add('active');
    } catch (error) {
        console.error('Error loading department:', error);
    }
}

function closeModal() {
    modal.classList.remove('active');
    currentEditId = null;
    currentEditType = null;
}

// ==========================================
// FORM HANDLERS
// ==========================================

async function handleEmployeeSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    const employeeData = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        department: formData.get('department')
    };

    try {
        if (currentEditId) {
            await updateEmployee(currentEditId, employeeData);
        } else {
            await createEmployee(employeeData);
        }

        closeModal();
        await loadData();
        renderView('employees');
    } catch (error) {
        console.error('Error saving employee:', error);
    }
}

async function handleDepartmentSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    const departmentData = {
        name: formData.get('name')
    };

    try {
        if (currentEditId) {
            await updateDepartment(currentEditId, departmentData);
        } else {
            await createDepartment(departmentData);
        }

        closeModal();
        await loadData();
        renderView('departments');
    } catch (error) {
        console.error('Error saving department:', error);
    }
}

// ==========================================
// DELETE FUNCTIONS
// ==========================================

function confirmDeleteEmployee(id) {
    const employee = employees.find(emp => emp._id === id);
    if (!employee) return;

    const confirmed = confirm(`¿Estás seguro de que deseas eliminar a ${employee.firstName} ${employee.lastName}?`);
    if (confirmed) {
        handleDeleteEmployee(id);
    }
}

async function handleDeleteEmployee(id) {
    try {
        await deleteEmployee(id);
        await loadData();
        renderView('employees');
    } catch (error) {
        console.error('Error deleting employee:', error);
    }
}

function confirmDeleteDepartment(id) {
    const department = departments.find(dept => dept._id === id);
    if (!department) return;

    const employeeCount = employees.filter(emp => emp.department === id).length;
    const message = employeeCount > 0
        ? `¿Estás seguro? Este departamento tiene ${employeeCount} empleado(s) asignado(s).`
        : `¿Estás seguro de que deseas eliminar el departamento "${department.name}"?`;

    const confirmed = confirm(message);
    if (confirmed) {
        handleDeleteDepartment(id);
    }
}

async function handleDeleteDepartment(id) {
    try {
        await deleteDepartment(id);
        await loadData();
        renderView('departments');
    } catch (error) {
        console.error('Error deleting department:', error);
    }
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

function handleSearch(event) {
    const query = event.target.value.toLowerCase();
    // Implement search logic here
    console.log('Searching for:', query);
}

function viewDepartmentDetails(id) {
    editDepartment(id);
}

function exportData() {
    const data = {
        departments,
        employees,
        exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dentalpro-export-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    showToast('Datos exportados exitosamente', 'success');
}