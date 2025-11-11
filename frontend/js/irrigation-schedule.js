// Irrigation Schedule Management
let currentPage = 1;
const itemsPerPage = 10;
let schedules = [];
let filteredSchedules = [];
let scheduleToDelete = null;

// API Base URL - Update this to your backend URL
const API_BASE_URL = 'http://localhost:8000/api';

// Sample data for demonstration
const sampleSchedules = [
    {
        id: 1,
        cropName: 'Wheat',
        fieldLocation: 'Field A-12',
        moistureLevel: 65,
        startTime: '06:00',
        endTime: '08:30',
        waterUsed: 5000,
        date: '2025-10-05',
        weather: 'Sunny',
        nextSchedule: '2025-10-07',
        workerName: 'John Smith',
        status: 'Completed'
    },
    {
        id: 2,
        cropName: 'Rice',
        fieldLocation: 'Field B-08',
        moistureLevel: 45,
        startTime: '07:00',
        endTime: '09:00',
        waterUsed: 8000,
        date: '2025-10-05',
        weather: 'Cloudy',
        nextSchedule: '2025-10-06',
        workerName: 'Maria Garcia',
        status: 'Completed'
    },
    {
        id: 3,
        cropName: 'Corn',
        fieldLocation: 'Field C-15',
        moistureLevel: 38,
        startTime: '08:00',
        endTime: '10:30',
        waterUsed: 6500,
        date: '2025-10-05',
        weather: 'Partly Cloudy',
        nextSchedule: '2025-10-07',
        workerName: 'David Johnson',
        status: 'In Progress'
    },
    {
        id: 4,
        cropName: 'Cotton',
        fieldLocation: 'Field D-20',
        moistureLevel: 52,
        startTime: '09:00',
        endTime: '11:00',
        waterUsed: 4500,
        date: '2025-10-05',
        weather: 'Sunny',
        nextSchedule: '2025-10-08',
        workerName: 'Sarah Williams',
        status: 'Pending'
    },
    {
        id: 5,
        cropName: 'Tomato',
        fieldLocation: 'Field E-05',
        moistureLevel: 70,
        startTime: '10:00',
        endTime: '11:30',
        waterUsed: 3500,
        date: '2025-10-05',
        weather: 'Cloudy',
        nextSchedule: '2025-10-06',
        workerName: 'Michael Brown',
        status: 'Completed'
    },
    {
        id: 6,
        cropName: 'Wheat',
        fieldLocation: 'Field A-14',
        moistureLevel: 42,
        startTime: '11:00',
        endTime: '13:00',
        waterUsed: 5200,
        date: '2025-10-05',
        weather: 'Sunny',
        nextSchedule: '2025-10-07',
        workerName: 'John Smith',
        status: 'Pending'
    },
    {
        id: 7,
        cropName: 'Potato',
        fieldLocation: 'Field F-18',
        moistureLevel: 58,
        startTime: '14:00',
        endTime: '16:00',
        waterUsed: 4800,
        date: '2025-10-05',
        weather: 'Partly Cloudy',
        nextSchedule: '2025-10-07',
        workerName: 'Emily Davis',
        status: 'Pending'
    },
    {
        id: 8,
        cropName: 'Rice',
        fieldLocation: 'Field B-10',
        moistureLevel: 75,
        startTime: '15:00',
        endTime: '17:30',
        waterUsed: 7500,
        date: '2025-10-05',
        weather: 'Cloudy',
        nextSchedule: '2025-10-06',
        workerName: 'Maria Garcia',
        status: 'Completed'
    },
    {
        id: 9,
        cropName: 'Corn',
        fieldLocation: 'Field C-16',
        moistureLevel: 48,
        startTime: '16:00',
        endTime: '18:00',
        waterUsed: 6200,
        date: '2025-10-04',
        weather: 'Rainy',
        nextSchedule: '2025-10-08',
        workerName: 'David Johnson',
        status: 'Completed'
    },
    {
        id: 10,
        cropName: 'Cotton',
        fieldLocation: 'Field D-22',
        moistureLevel: 35,
        startTime: '17:00',
        endTime: '18:30',
        waterUsed: 4200,
        date: '2025-10-04',
        weather: 'Sunny',
        nextSchedule: '2025-10-08',
        workerName: 'Sarah Williams',
        status: 'Completed'
    },
    {
        id: 11,
        cropName: 'Wheat',
        fieldLocation: 'Field A-13',
        moistureLevel: 55,
        startTime: '06:30',
        endTime: '08:00',
        waterUsed: 5100,
        date: '2025-10-04',
        weather: 'Cloudy',
        nextSchedule: '2025-10-06',
        workerName: 'John Smith',
        status: 'Completed'
    },
    {
        id: 12,
        cropName: 'Tomato',
        fieldLocation: 'Field E-07',
        moistureLevel: 68,
        startTime: '07:30',
        endTime: '09:00',
        waterUsed: 3800,
        date: '2025-10-04',
        weather: 'Partly Cloudy',
        nextSchedule: '2025-10-05',
        workerName: 'Michael Brown',
        status: 'Completed'
    }
];

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadSchedules();
    setupEventListeners();
    setDefaultDate();
});

function setupEventListeners() {
    // Add Schedule Button
    document.getElementById('addScheduleBtn').addEventListener('click', openAddModal);
    
    // Modal Close Buttons
    document.getElementById('modalClose').addEventListener('click', closeModal);
    document.getElementById('cancelBtn').addEventListener('click', closeModal);
    document.getElementById('deleteModalClose').addEventListener('click', closeDeleteModal);
    document.getElementById('cancelDeleteBtn').addEventListener('click', closeDeleteModal);
    
    // Form Submit
    document.getElementById('scheduleForm').addEventListener('submit', handleFormSubmit);
    
    // Delete Confirm
    document.getElementById('confirmDeleteBtn').addEventListener('click', confirmDelete);
    
    // Filters
    document.getElementById('statusFilter').addEventListener('change', applyFilters);
    document.getElementById('cropFilter').addEventListener('change', applyFilters);
    document.getElementById('startDate').addEventListener('change', applyFilters);
    document.getElementById('endDate').addEventListener('change', applyFilters);
    document.getElementById('resetFilters').addEventListener('click', resetFilters);
    
    // Pagination
    document.getElementById('prevPage').addEventListener('click', () => changePage(-1));
    document.getElementById('nextPage').addEventListener('click', () => changePage(1));
}

function setDefaultDate() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('scheduleDate').value = today;
}

// Load schedules from API or use sample data
async function loadSchedules() {
    try {
        // Try to fetch from API
        // const response = await fetch(`${API_BASE_URL}/irrigation-schedules`);
        // schedules = await response.json();
        
        // For now, use sample data
        schedules = sampleSchedules;
        filteredSchedules = [...schedules];
        renderTable();
        renderPagination();
    } catch (error) {
        console.error('Error loading schedules:', error);
        schedules = sampleSchedules;
        filteredSchedules = [...schedules];
        renderTable();
        renderPagination();
    }
}

function renderTable() {
    const tbody = document.getElementById('scheduleTableBody');
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageData = filteredSchedules.slice(start, end);
    
    if (pageData.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="12" class="empty-state">
                    <i class="fas fa-calendar-times"></i>
                    <h3>No irrigation schedules found</h3>
                    <p>Add a new schedule to get started</p>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = pageData.map(schedule => `
        <tr data-id="${schedule.id}">
            <td><strong>${schedule.cropName}</strong></td>
            <td>${schedule.fieldLocation}</td>
            <td>
                <div class="moisture-bar">
                    <div class="moisture-progress">
                        <div class="moisture-fill" style="width: ${schedule.moistureLevel}%"></div>
                    </div>
                    <span class="moisture-value">${schedule.moistureLevel}%</span>
                </div>
            </td>
            <td>${schedule.startTime}</td>
            <td>${schedule.endTime}</td>
            <td>${schedule.waterUsed.toLocaleString()}</td>
            <td>${formatDate(schedule.date)}</td>
            <td><span class="weather-badge">${getWeatherIcon(schedule.weather)} ${schedule.weather}</span></td>
            <td>${formatDate(schedule.nextSchedule)}</td>
            <td>${schedule.workerName}</td>
            <td><span class="status-badge ${schedule.status.toLowerCase().replace(' ', '-')}">${schedule.status}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn edit" onclick="editSchedule(${schedule.id})" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" onclick="deleteSchedule(${schedule.id})" title="Delete">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function renderPagination() {
    const totalPages = Math.ceil(filteredSchedules.length / itemsPerPage);
    const pageNumbers = document.getElementById('pageNumbers');
    
    // Update prev/next buttons
    document.getElementById('prevPage').disabled = currentPage === 1;
    document.getElementById('nextPage').disabled = currentPage === totalPages || totalPages === 0;
    
    // Render page numbers
    let pagesHTML = '';
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            pagesHTML += `
                <button class="page-number ${i === currentPage ? 'active' : ''}" 
                        onclick="goToPage(${i})">
                    ${i}
                </button>
            `;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            pagesHTML += '<span style="padding: 0 0.5rem;">...</span>';
        }
    }
    pageNumbers.innerHTML = pagesHTML;
}

function changePage(direction) {
    const totalPages = Math.ceil(filteredSchedules.length / itemsPerPage);
    currentPage += direction;
    if (currentPage < 1) currentPage = 1;
    if (currentPage > totalPages) currentPage = totalPages;
    renderTable();
    renderPagination();
}

function goToPage(page) {
    currentPage = page;
    renderTable();
    renderPagination();
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function getWeatherIcon(weather) {
    const icons = {
        'Sunny': '☀️',
        'Cloudy': '☁️',
        'Rainy': '🌧️',
        'Partly Cloudy': '⛅'
    };
    return icons[weather] || '🌤️';
}

// Modal Functions
function openAddModal() {
    document.getElementById('modalTitle').textContent = 'Add New Schedule';
    document.getElementById('scheduleForm').reset();
    document.getElementById('scheduleId').value = '';
    setDefaultDate();
    document.getElementById('scheduleModal').classList.add('active');
}

function openEditModal(schedule) {
    document.getElementById('modalTitle').textContent = 'Edit Schedule';
    document.getElementById('scheduleId').value = schedule.id;
    document.getElementById('cropName').value = schedule.cropName;
    document.getElementById('fieldLocation').value = schedule.fieldLocation;
    document.getElementById('moistureLevel').value = schedule.moistureLevel;
    document.getElementById('startTime').value = schedule.startTime;
    document.getElementById('endTime').value = schedule.endTime;
    document.getElementById('waterUsed').value = schedule.waterUsed;
    document.getElementById('scheduleDate').value = schedule.date;
    document.getElementById('weatherCondition').value = schedule.weather;
    document.getElementById('nextSchedule').value = schedule.nextSchedule;
    document.getElementById('workerName').value = schedule.workerName;
    document.getElementById('status').value = schedule.status;
    document.getElementById('scheduleModal').classList.add('active');
}

function closeModal() {
    document.getElementById('scheduleModal').classList.remove('active');
}

function closeDeleteModal() {
    document.getElementById('deleteModal').classList.remove('active');
    scheduleToDelete = null;
}

// CRUD Operations
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const scheduleData = {
        id: document.getElementById('scheduleId').value || Date.now(),
        cropName: document.getElementById('cropName').value,
        fieldLocation: document.getElementById('fieldLocation').value,
        moistureLevel: parseInt(document.getElementById('moistureLevel').value),
        startTime: document.getElementById('startTime').value,
        endTime: document.getElementById('endTime').value,
        waterUsed: parseInt(document.getElementById('waterUsed').value),
        date: document.getElementById('scheduleDate').value,
        weather: document.getElementById('weatherCondition').value,
        nextSchedule: document.getElementById('nextSchedule').value,
        workerName: document.getElementById('workerName').value,
        status: document.getElementById('status').value
    };
    
    try {
        if (document.getElementById('scheduleId').value) {
            // Update existing schedule
            await updateSchedule(scheduleData);
        } else {
            // Create new schedule
            await createSchedule(scheduleData);
        }
        
        closeModal();
        showNotification('Schedule saved successfully!', 'success');
    } catch (error) {
        console.error('Error saving schedule:', error);
        showNotification('Error saving schedule. Please try again.', 'error');
    }
}

async function createSchedule(data) {
    try {
        // Try to save to API
        // const response = await fetch(`${API_BASE_URL}/irrigation-schedules`, {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(data)
        // });
        // const newSchedule = await response.json();
        
        // For now, add to local array
        schedules.unshift(data);
        filteredSchedules = [...schedules];
        renderTable();
        renderPagination();
    } catch (error) {
        throw error;
    }
}

async function updateSchedule(data) {
    try {
        // Try to update via API
        // const response = await fetch(`${API_BASE_URL}/irrigation-schedules/${data.id}`, {
        //     method: 'PUT',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(data)
        // });
        
        // For now, update local array
        const index = schedules.findIndex(s => s.id == data.id);
        if (index !== -1) {
            schedules[index] = data;
            filteredSchedules = [...schedules];
            applyFilters();
        }
    } catch (error) {
        throw error;
    }
}

function editSchedule(id) {
    const schedule = schedules.find(s => s.id === id);
    if (schedule) {
        openEditModal(schedule);
    }
}

function deleteSchedule(id) {
    scheduleToDelete = id;
    document.getElementById('deleteModal').classList.add('active');
}

async function confirmDelete() {
    if (!scheduleToDelete) return;
    
    try {
        // Try to delete via API
        // await fetch(`${API_BASE_URL}/irrigation-schedules/${scheduleToDelete}`, {
        //     method: 'DELETE'
        // });
        
        // For now, delete from local array
        schedules = schedules.filter(s => s.id !== scheduleToDelete);
        filteredSchedules = [...schedules];
        
        // Adjust current page if necessary
        const totalPages = Math.ceil(filteredSchedules.length / itemsPerPage);
        if (currentPage > totalPages && currentPage > 1) {
            currentPage = totalPages;
        }
        
        renderTable();
        renderPagination();
        closeDeleteModal();
        showNotification('Schedule deleted successfully!', 'success');
    } catch (error) {
        console.error('Error deleting schedule:', error);
        showNotification('Error deleting schedule. Please try again.', 'error');
    }
}

// Filters
function applyFilters() {
    const statusFilter = document.getElementById('statusFilter').value;
    const cropFilter = document.getElementById('cropFilter').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    
    filteredSchedules = schedules.filter(schedule => {
        let match = true;
        
        if (statusFilter !== 'all') {
            match = match && schedule.status.toLowerCase() === statusFilter.toLowerCase();
        }
        
        if (cropFilter !== 'all') {
            match = match && schedule.cropName.toLowerCase() === cropFilter.toLowerCase();
        }
        
        if (startDate) {
            match = match && schedule.date >= startDate;
        }
        
        if (endDate) {
            match = match && schedule.date <= endDate;
        }
        
        return match;
    });
    
    currentPage = 1;
    renderTable();
    renderPagination();
}

function resetFilters() {
    document.getElementById('statusFilter').value = 'all';
    document.getElementById('cropFilter').value = 'all';
    document.getElementById('startDate').value = '';
    document.getElementById('endDate').value = '';
    filteredSchedules = [...schedules];
    currentPage = 1;
    renderTable();
    renderPagination();
}

// Notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = 'notification show';
    notification.style.background = type === 'success' 
        ? 'linear-gradient(135deg, #4CAF50, #388E3C)' 
        : 'linear-gradient(135deg, #F44336, #D32F2F)';
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}
