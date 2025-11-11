// Pump Stats - Main JavaScript
const API_BASE_URL = 'http://localhost:8000/api';

// State Management
let pumpsData = [];
let filteredPumps = [];
let powerTrendChart = null;
let runtimeChart = null;
let editingPumpId = null;
let controllingPumpId = null;

// Pump status colors
const statusColors = {
    running: '#4CAF50',
    idle: '#6C757D',
    maintenance: '#FF9800',
    error: '#F44336'
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeCharts();
    loadPumpsData();
    loadSystemStats();
    setupEventListeners();
    setupRealTimeUpdates();
    setTodayDate();
});

// Setup Event Listeners
function setupEventListeners() {
    // Modal controls
    document.getElementById('addPumpBtn')?.addEventListener('click', openAddModal);
    document.getElementById('modalClose')?.addEventListener('click', closePumpModal);
    document.getElementById('cancelBtn')?.addEventListener('click', closePumpModal);
    document.getElementById('controlModalClose')?.addEventListener('click', closeControlModal);
    document.getElementById('deleteModalClose')?.addEventListener('click', closeDeleteModal);
    document.getElementById('cancelDeleteBtn')?.addEventListener('click', closeDeleteModal);
    document.getElementById('confirmDeleteBtn')?.addEventListener('click', confirmDelete);
    
    // Form submission
    document.getElementById('pumpForm')?.addEventListener('submit', handleFormSubmit);
    
    // Filter tabs
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            const filter = this.dataset.filter;
            applyStatusFilter(filter);
        });
    });
    
    // Chart period buttons
    document.querySelectorAll('.chart-controls .btn-small').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.chart-controls .btn-small').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const period = parseInt(this.dataset.period);
            updatePowerTrendChart(period);
        });
    });
    
    // Control buttons
    document.getElementById('startPumpBtn')?.addEventListener('click', () => controlPump('start'));
    document.getElementById('stopPumpBtn')?.addEventListener('click', () => controlPump('stop'));
    document.getElementById('maintenanceBtn')?.addEventListener('click', () => controlPump('maintenance'));
    
    // Refresh button
    document.getElementById('refreshBtn')?.addEventListener('click', refreshAllData);
    
    // Export button
    document.getElementById('exportReportBtn')?.addEventListener('click', exportReport);
    
    // View all alerts
    document.getElementById('viewAllAlertsBtn')?.addEventListener('click', viewAllAlerts);
}

// Load System Stats
async function loadSystemStats() {
    try {
        // Calculate stats from pumps data
        const activePumps = pumpsData.filter(p => p.status === 'running').length;
        const totalPower = pumpsData.reduce((sum, p) => sum + (p.status === 'running' ? p.powerConsumption : 0), 0);
        const totalFlowRate = pumpsData.reduce((sum, p) => sum + (p.status === 'running' ? p.flowRate : 0), 0);
        const avgRuntime = pumpsData.reduce((sum, p) => sum + p.runtimeToday, 0) / pumpsData.length || 0;
        
        // Update stat cards
        document.getElementById('activePumpsValue').textContent = `${activePumps}/${pumpsData.length}`;
        document.getElementById('powerConsumptionValue').textContent = totalPower.toFixed(1) + ' kW';
        document.getElementById('flowRateValue').textContent = totalFlowRate.toFixed(0) + ' L/min';
        document.getElementById('runtimeValue').textContent = avgRuntime.toFixed(1) + ' hrs';
        
        // Update trends
        const totalEnergyToday = pumpsData.reduce((sum, p) => sum + p.energyToday, 0);
        document.getElementById('powerTrend').innerHTML = `<i class="fas fa-bolt"></i> ${totalEnergyToday.toFixed(1)} kWh today`;
        
        // Update runtime trend
        const withinLimits = avgRuntime < 8;
        const runtimeIcon = withinLimits ? 'check' : 'exclamation-triangle';
        const runtimeClass = withinLimits ? 'positive' : 'negative';
        document.getElementById('runtimeTrend').className = `stat-trend ${runtimeClass}`;
        document.getElementById('runtimeTrend').innerHTML = `<i class="fas fa-${runtimeIcon}"></i> ${withinLimits ? 'Within limits' : 'High usage'}`;
        
    } catch (error) {
        console.error('Error loading system stats:', error);
    }
}

// Load Pumps Data
async function loadPumpsData() {
    try {
        // Mock data - replace with actual API call
        // const response = await fetch(`${API_BASE_URL}/pumps/status`);
        // pumpsData = await response.json();
        
        pumpsData = [
            {
                id: 1,
                name: 'Pump-A01',
                location: 'North Field - Borewell',
                status: 'running',
                powerRating: 5.0,
                flowRate: 150,
                voltage: 415,
                current: 8.5,
                powerConsumption: 5.2,
                runtimeToday: 6.5,
                temperature: 45,
                efficiency: 92,
                lastMaintenance: '2024-09-15',
                nextMaintenance: '2024-12-15',
                manufacturer: 'CRI Pumps',
                modelNumber: 'CR-500X',
                installationDate: '2023-01-15',
                energyToday: 33.8,
                totalRuntime: 2340
            },
            {
                id: 2,
                name: 'Pump-B02',
                location: 'South Field - Main Tank',
                status: 'running',
                powerRating: 7.5,
                flowRate: 200,
                voltage: 415,
                current: 12.2,
                powerConsumption: 7.8,
                runtimeToday: 5.2,
                temperature: 48,
                efficiency: 88,
                lastMaintenance: '2024-08-20',
                nextMaintenance: '2024-11-20',
                manufacturer: 'Kirloskar',
                modelNumber: 'KL-750',
                installationDate: '2023-03-10',
                energyToday: 40.6,
                totalRuntime: 1980
            },
            {
                id: 3,
                name: 'Pump-C03',
                location: 'East Field - Canal',
                status: 'idle',
                powerRating: 3.0,
                flowRate: 0,
                voltage: 0,
                current: 0,
                powerConsumption: 0,
                runtimeToday: 2.8,
                temperature: 28,
                efficiency: 90,
                lastMaintenance: '2024-09-01',
                nextMaintenance: '2024-12-01',
                manufacturer: 'Havells',
                modelNumber: 'HV-300',
                installationDate: '2023-05-22',
                energyToday: 8.4,
                totalRuntime: 1560
            },
            {
                id: 4,
                name: 'Pump-D04',
                location: 'West Field - Rainwater',
                status: 'maintenance',
                powerRating: 4.0,
                flowRate: 0,
                voltage: 0,
                current: 0,
                powerConsumption: 0,
                runtimeToday: 0,
                temperature: 25,
                efficiency: 0,
                lastMaintenance: '2024-10-01',
                nextMaintenance: '2024-10-15',
                manufacturer: 'Crompton',
                modelNumber: 'CP-400',
                installationDate: '2023-07-08',
                energyToday: 0,
                totalRuntime: 1245
            },
            {
                id: 5,
                name: 'Pump-E05',
                location: 'Central Field - Borewell',
                status: 'running',
                powerRating: 6.0,
                flowRate: 175,
                voltage: 415,
                current: 10.5,
                powerConsumption: 6.4,
                runtimeToday: 7.2,
                temperature: 52,
                efficiency: 85,
                lastMaintenance: '2024-07-15',
                nextMaintenance: '2024-10-15',
                manufacturer: 'CRI Pumps',
                modelNumber: 'CR-600X',
                installationDate: '2022-11-20',
                energyToday: 46.1,
                totalRuntime: 3120
            },
            {
                id: 6,
                name: 'Pump-F06',
                location: 'North Field - Secondary',
                status: 'error',
                powerRating: 5.5,
                flowRate: 0,
                voltage: 380,
                current: 15.2,
                powerConsumption: 0,
                runtimeToday: 1.5,
                temperature: 68,
                efficiency: 0,
                lastMaintenance: '2024-08-10',
                nextMaintenance: '2024-11-10',
                manufacturer: 'Kirloskar',
                modelNumber: 'KL-550',
                installationDate: '2023-02-14',
                energyToday: 8.3,
                totalRuntime: 1890
            }
        ];
        
        filteredPumps = [...pumpsData];
        renderPumpsGrid();
        renderPumpsTable();
        updateCharts();
        loadSystemStats();
        loadAlerts();
        
    } catch (error) {
        console.error('Error loading pumps data:', error);
        showError('Failed to load pumps data');
    }
}

// Render Pumps Grid
function renderPumpsGrid() {
    const grid = document.getElementById('pumpsGrid');
    if (!grid) return;
    
    if (filteredPumps.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-cog"></i>
                <h3>No pumps found</h3>
                <p>Add a new pump to get started</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = filteredPumps.map(pump => {
        const statusIcon = pump.status === 'running' ? 'play-circle' : 
                          pump.status === 'idle' ? 'pause-circle' :
                          pump.status === 'maintenance' ? 'wrench' : 'exclamation-circle';
        
        return `
            <div class="pump-card ${pump.status}">
                <div class="pump-card-header">
                    <div class="pump-info">
                        <h4>${pump.name}</h4>
                        <p><i class="fas fa-map-marker-alt"></i> ${pump.location}</p>
                    </div>
                    <span class="pump-status-badge ${pump.status}">
                        <i class="fas fa-${statusIcon}"></i>
                        ${pump.status.charAt(0).toUpperCase() + pump.status.slice(1)}
                    </span>
                </div>
                
                <div class="pump-metrics">
                    <div class="metric-item">
                        <span class="metric-label">Flow Rate</span>
                        <span class="metric-value">${pump.flowRate} L/min</span>
                    </div>
                    <div class="metric-item">
                        <span class="metric-label">Power</span>
                        <span class="metric-value">${pump.powerConsumption} kW</span>
                    </div>
                    <div class="metric-item">
                        <span class="metric-label">Runtime</span>
                        <span class="metric-value">${pump.runtimeToday}h</span>
                    </div>
                    <div class="metric-item">
                        <span class="metric-label">Temp</span>
                        <span class="metric-value">${pump.temperature}°C</span>
                    </div>
                </div>
                
                <div class="pump-actions">
                    <button class="pump-action-btn control" onclick="openControlModal(${pump.id})" title="Control Pump">
                        <i class="fas fa-sliders-h"></i> Control
                    </button>
                    <button class="pump-action-btn edit" onclick="editPump(${pump.id})" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="pump-action-btn delete" onclick="deletePump(${pump.id})" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Render Pumps Table
function renderPumpsTable() {
    const tbody = document.getElementById('pumpTableBody');
    if (!tbody) return;
    
    if (filteredPumps.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="10" class="empty-state">
                    <i class="fas fa-cog"></i>
                    <h3>No pumps found</h3>
                    <p>Try adjusting your filters or add a new pump</p>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = filteredPumps.map(pump => {
        const daysUntilMaintenance = calculateDaysUntil(pump.nextMaintenance);
        const maintenanceClass = daysUntilMaintenance < 7 ? 'text-danger' : daysUntilMaintenance < 30 ? 'text-warning' : '';
        
        return `
            <tr>
                <td><strong>${pump.name}</strong></td>
                <td>${pump.location}</td>
                <td>
                    <span class="status-indicator ${pump.status}"></span>
                    ${pump.status.charAt(0).toUpperCase() + pump.status.slice(1)}
                </td>
                <td>${pump.powerRating} HP</td>
                <td><strong>${pump.flowRate} L/min</strong></td>
                <td>${pump.runtimeToday.toFixed(1)} hrs</td>
                <td>
                    ${pump.temperature}°C
                    ${pump.temperature > 60 ? '<i class="fas fa-exclamation-triangle" style="color: var(--danger-color);"></i>' : ''}
                </td>
                <td>
                    <div class="efficiency-bar">
                        <div class="efficiency-fill" style="width: ${pump.efficiency}%"></div>
                    </div>
                    ${pump.efficiency}%
                </td>
                <td class="${maintenanceClass}">
                    ${formatDate(pump.nextMaintenance)}
                    ${daysUntilMaintenance < 7 ? '<br><small>(Due soon!)</small>' : ''}
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn control" onclick="openControlModal(${pump.id})" title="Control">
                            <i class="fas fa-sliders-h"></i>
                        </button>
                        <button class="action-btn edit" onclick="editPump(${pump.id})" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete" onclick="deletePump(${pump.id})" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// Apply Status Filter
function applyStatusFilter(status) {
    if (status === 'all') {
        filteredPumps = [...pumpsData];
    } else {
        filteredPumps = pumpsData.filter(pump => pump.status === status);
    }
    
    renderPumpsGrid();
    renderPumpsTable();
}

// Initialize Charts
function initializeCharts() {
    // Power Trend Chart
    const powerCtx = document.getElementById('powerTrendChart');
    if (powerCtx) {
        powerTrendChart = new Chart(powerCtx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Power Consumption (kW)',
                    data: [],
                    borderColor: '#2196F3',
                    backgroundColor: 'rgba(33, 150, 243, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return 'Power: ' + context.parsed.y.toFixed(2) + ' kW';
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return value + ' kW';
                            }
                        }
                    }
                }
            }
        });
        
        updatePowerTrendChart(24);
    }
    
    // Runtime Distribution Chart
    const runtimeCtx = document.getElementById('runtimeChart');
    if (runtimeCtx) {
        runtimeChart = new Chart(runtimeCtx, {
            type: 'doughnut',
            data: {
                labels: [],
                datasets: [{
                    data: [],
                    backgroundColor: [
                        '#2196F3',
                        '#4CAF50',
                        '#FF9800',
                        '#9C27B0',
                        '#F44336',
                        '#00BCD4'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed || 0;
                                return label + ': ' + value.toFixed(1) + ' hrs';
                            }
                        }
                    }
                }
            }
        });
        
        updateRuntimeChart();
    }
}

// Update Power Trend Chart
function updatePowerTrendChart(hours) {
    if (!powerTrendChart) return;
    
    const labels = [];
    const data = [];
    
    // Generate mock hourly data
    for (let i = hours - 1; i >= 0; i--) {
        const time = new Date();
        time.setHours(time.getHours() - i);
        labels.push(time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
        
        // Simulate power consumption with some variation
        const basePower = pumpsData.reduce((sum, p) => sum + (p.status === 'running' ? p.powerConsumption : 0), 0);
        const variation = (Math.random() - 0.5) * 5;
        data.push(Math.max(0, basePower + variation));
    }
    
    powerTrendChart.data.labels = labels;
    powerTrendChart.data.datasets[0].data = data;
    powerTrendChart.update();
}

// Update Runtime Chart
function updateRuntimeChart() {
    if (!runtimeChart) return;
    
    const labels = pumpsData.map(p => p.name);
    const data = pumpsData.map(p => p.runtimeToday);
    
    runtimeChart.data.labels = labels;
    runtimeChart.data.datasets[0].data = data;
    runtimeChart.update();
}

// Update Charts
function updateCharts() {
    updatePowerTrendChart(24);
    updateRuntimeChart();
}

// Load Alerts
function loadAlerts() {
    const alertsList = document.getElementById('alertsList');
    if (!alertsList) return;
    
    const alerts = [];
    
    // Check for pumps with issues
    pumpsData.forEach(pump => {
        if (pump.status === 'error') {
            alerts.push({
                type: 'error',
                icon: 'exclamation-circle',
                title: `${pump.name} Error`,
                message: `Pump has stopped unexpectedly. Check voltage and current readings.`,
                time: '5 minutes ago'
            });
        }
        
        if (pump.temperature > 60) {
            alerts.push({
                type: 'warning',
                icon: 'temperature-high',
                title: `High Temperature Alert`,
                message: `${pump.name} temperature is ${pump.temperature}°C. Normal operation is below 55°C.`,
                time: '10 minutes ago'
            });
        }
        
        const daysUntil = calculateDaysUntil(pump.nextMaintenance);
        if (daysUntil < 7 && pump.status !== 'maintenance') {
            alerts.push({
                type: 'warning',
                icon: 'wrench',
                title: `Maintenance Due Soon`,
                message: `${pump.name} maintenance scheduled for ${formatDate(pump.nextMaintenance)}.`,
                time: '1 hour ago'
            });
        }
        
        if (pump.status === 'running' && pump.efficiency < 85) {
            alerts.push({
                type: 'info',
                icon: 'info-circle',
                title: `Low Efficiency`,
                message: `${pump.name} operating at ${pump.efficiency}% efficiency. Consider inspection.`,
                time: '2 hours ago'
            });
        }
    });
    
    if (alerts.length === 0) {
        alertsList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-check-circle" style="color: var(--success-color);"></i>
                <h3>All Systems Normal</h3>
                <p>No alerts at this time</p>
            </div>
        `;
        return;
    }
    
    // Show only first 3 alerts
    alertsList.innerHTML = alerts.slice(0, 3).map(alert => `
        <div class="alert-item ${alert.type}">
            <div class="alert-icon">
                <i class="fas fa-${alert.icon}"></i>
            </div>
            <div class="alert-content">
                <h4>${alert.title}</h4>
                <p>${alert.message}</p>
                <span class="alert-time"><i class="fas fa-clock"></i> ${alert.time}</span>
            </div>
        </div>
    `).join('');
}

// Modal Functions
function openAddModal() {
    editingPumpId = null;
    document.getElementById('modalTitle').textContent = 'Add New Pump';
    document.getElementById('pumpForm').reset();
    document.getElementById('pumpId').value = '';
    document.getElementById('pumpModal').classList.add('active');
}

function openEditModal(pump) {
    editingPumpId = pump.id;
    document.getElementById('modalTitle').textContent = 'Edit Pump Details';
    document.getElementById('pumpId').value = pump.id;
    document.getElementById('pumpName').value = pump.name;
    document.getElementById('pumpLocation').value = pump.location;
    document.getElementById('powerRating').value = pump.powerRating;
    document.getElementById('maxFlowRate').value = pump.flowRate;
    document.getElementById('installationDate').value = pump.installationDate;
    document.getElementById('manufacturer').value = pump.manufacturer;
    document.getElementById('modelNumber').value = pump.modelNumber;
    document.getElementById('maintenanceInterval').value = 90; // Default
    document.getElementById('pumpNotes').value = pump.notes || '';
    document.getElementById('pumpModal').classList.add('active');
}

function closePumpModal() {
    document.getElementById('pumpModal').classList.remove('active');
    editingPumpId = null;
}

function openControlModal(pumpId) {
    controllingPumpId = pumpId;
    const pump = pumpsData.find(p => p.id === pumpId);
    
    if (pump) {
        document.getElementById('controlPumpName').textContent = pump.name;
        document.getElementById('controlPumpLocation').textContent = pump.location;
        document.getElementById('controlModal').classList.add('active');
    }
}

function closeControlModal() {
    document.getElementById('controlModal').classList.remove('active');
    controllingPumpId = null;
}

function closeDeleteModal() {
    document.getElementById('deleteModal').classList.remove('active');
    editingPumpId = null;
}

// CRUD Operations
function editPump(id) {
    const pump = pumpsData.find(p => p.id === id);
    if (pump) {
        openEditModal(pump);
    }
}

function deletePump(id) {
    editingPumpId = id;
    document.getElementById('deleteModal').classList.add('active');
}

function confirmDelete() {
    if (!editingPumpId) return;
    
    // Remove from data
    pumpsData = pumpsData.filter(p => p.id !== editingPumpId);
    filteredPumps = filteredPumps.filter(p => p.id !== editingPumpId);
    
    renderPumpsGrid();
    renderPumpsTable();
    loadSystemStats();
    updateCharts();
    loadAlerts();
    closeDeleteModal();
    showSuccess('Pump deleted successfully');
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = {
        id: editingPumpId || Date.now(),
        name: document.getElementById('pumpName').value,
        location: document.getElementById('pumpLocation').value,
        powerRating: parseFloat(document.getElementById('powerRating').value),
        flowRate: parseInt(document.getElementById('maxFlowRate').value),
        installationDate: document.getElementById('installationDate').value,
        manufacturer: document.getElementById('manufacturer').value,
        modelNumber: document.getElementById('modelNumber').value,
        notes: document.getElementById('pumpNotes').value,
        status: 'idle',
        voltage: 0,
        current: 0,
        powerConsumption: 0,
        runtimeToday: 0,
        temperature: 25,
        efficiency: 0,
        lastMaintenance: new Date().toISOString().split('T')[0],
        nextMaintenance: calculateNextMaintenance(90),
        energyToday: 0,
        totalRuntime: 0
    };
    
    if (editingPumpId) {
        // Update existing pump
        const index = pumpsData.findIndex(p => p.id === editingPumpId);
        if (index !== -1) {
            // Preserve runtime data
            formData.status = pumpsData[index].status;
            formData.voltage = pumpsData[index].voltage;
            formData.current = pumpsData[index].current;
            formData.powerConsumption = pumpsData[index].powerConsumption;
            formData.runtimeToday = pumpsData[index].runtimeToday;
            formData.temperature = pumpsData[index].temperature;
            formData.efficiency = pumpsData[index].efficiency;
            formData.energyToday = pumpsData[index].energyToday;
            formData.totalRuntime = pumpsData[index].totalRuntime;
            
            pumpsData[index] = formData;
            showSuccess('Pump updated successfully');
        }
    } else {
        // Add new pump
        pumpsData.unshift(formData);
        showSuccess('Pump added successfully');
    }
    
    filteredPumps = [...pumpsData];
    renderPumpsGrid();
    renderPumpsTable();
    loadSystemStats();
    updateCharts();
    closePumpModal();
}

// Control Pump
function controlPump(action) {
    if (!controllingPumpId) return;
    
    const pump = pumpsData.find(p => p.id === controllingPumpId);
    if (!pump) return;
    
    switch(action) {
        case 'start':
            if (pump.status === 'idle') {
                pump.status = 'running';
                pump.flowRate = Math.floor(pump.powerRating * 30); // Approximate
                pump.voltage = 415;
                pump.current = pump.powerRating * 1.7;
                pump.powerConsumption = pump.powerRating * 1.2;
                pump.temperature = 35;
                pump.efficiency = 88 + Math.random() * 10;
                showSuccess(`${pump.name} started successfully`);
            } else {
                showError(`${pump.name} cannot be started from ${pump.status} state`);
            }
            break;
            
        case 'stop':
            if (pump.status === 'running') {
                pump.status = 'idle';
                pump.flowRate = 0;
                pump.voltage = 0;
                pump.current = 0;
                pump.powerConsumption = 0;
                pump.temperature = 28;
                pump.efficiency = 0;
                showSuccess(`${pump.name} stopped successfully`);
            } else {
                showError(`${pump.name} is not running`);
            }
            break;
            
        case 'maintenance':
            pump.status = 'maintenance';
            pump.flowRate = 0;
            pump.voltage = 0;
            pump.current = 0;
            pump.powerConsumption = 0;
            pump.efficiency = 0;
            showSuccess(`${pump.name} marked for maintenance`);
            break;
    }
    
    renderPumpsGrid();
    renderPumpsTable();
    loadSystemStats();
    updateCharts();
    loadAlerts();
    closeControlModal();
}

// Utility Functions
function calculateDaysUntil(dateStr) {
    const target = new Date(dateStr);
    const today = new Date();
    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

function calculateNextMaintenance(days) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function setTodayDate() {
    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('installationDate');
    if (dateInput && !dateInput.value) {
        dateInput.value = today;
    }
}

function showSuccess(message) {
    // Create toast notification
    const toast = document.createElement('div');
    toast.className = 'toast success';
    toast.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #4CAF50, #45a049);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10001;
        animation: slideInRight 0.3s ease;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-weight: 500;
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
    console.log('✓ ' + message);
}

function showError(message) {
    // Create toast notification
    const toast = document.createElement('div');
    toast.className = 'toast error';
    toast.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #F44336, #d32f2f);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10001;
        animation: slideInRight 0.3s ease;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-weight: 500;
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
    console.error('✗ ' + message);
}

function refreshAllData() {
    loadPumpsData();
    loadSystemStats();
    showSuccess('Data refreshed successfully');
}

function setupRealTimeUpdates() {
    // Update dashboard every 10 seconds
    setInterval(() => {
        // Simulate real-time updates
        pumpsData.forEach(pump => {
            if (pump.status === 'running') {
                // Slight variations in readings
                pump.temperature = Math.max(35, Math.min(65, pump.temperature + (Math.random() - 0.5) * 2));
                pump.flowRate = Math.max(0, pump.flowRate + (Math.random() - 0.5) * 5);
                pump.powerConsumption = pump.powerRating * 1.2 * (0.95 + Math.random() * 0.1);
                pump.current = pump.powerRating * 1.7 * (0.95 + Math.random() * 0.1);
                
                // Increment runtime
                pump.runtimeToday += 10 / 3600; // 10 seconds in hours
                pump.energyToday += pump.powerConsumption * (10 / 3600);
            }
        });
        
        loadSystemStats();
        renderPumpsGrid();
        renderPumpsTable();
        updateCharts();
    }, 10000);
}

function exportReport() {
    const reportData = {
        date: new Date().toISOString(),
        totalPumps: pumpsData.length,
        activePumps: pumpsData.filter(p => p.status === 'running').length,
        totalPower: pumpsData.reduce((sum, p) => sum + p.powerConsumption, 0),
        totalEnergy: pumpsData.reduce((sum, p) => sum + p.energyToday, 0),
        pumps: pumpsData
    };
    
    const dataStr = JSON.stringify(reportData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pump-stats-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showSuccess('Report exported successfully');
}

function viewAllAlerts() {
    showSuccess('All alerts view - to be implemented');
}

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
