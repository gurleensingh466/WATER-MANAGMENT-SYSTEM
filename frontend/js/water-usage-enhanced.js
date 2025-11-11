// Water Usage Enhanced - Main JavaScript
const API_BASE_URL = 'http://localhost:8000/api';

// State Management
let waterUsageData = [];
let filteredData = [];
let currentPage = 1;
const recordsPerPage = 10;
let usageTrendChart = null;
let distributionChart = null;
let editingRecordId = null;

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeCharts();
    loadWaterUsageData();
    loadDashboardStats();
    loadSourceLevels();
    setupEventListeners();
    setupRealTimeUpdates();
    setTodayDate();
});

// Setup Event Listeners
function setupEventListeners() {
    // Modal controls
    document.getElementById('addRecordBtn')?.addEventListener('click', openAddModal);
    document.getElementById('modalClose')?.addEventListener('click', closeUsageModal);
    document.getElementById('cancelBtn')?.addEventListener('click', closeUsageModal);
    document.getElementById('deleteModalClose')?.addEventListener('click', closeDeleteModal);
    document.getElementById('cancelDeleteBtn')?.addEventListener('click', closeDeleteModal);
    document.getElementById('confirmDeleteBtn')?.addEventListener('click', confirmDelete);
    
    // Form submission
    document.getElementById('usageForm')?.addEventListener('submit', handleFormSubmit);
    
    // Filter controls
    document.getElementById('searchField')?.addEventListener('input', applyFilters);
    document.getElementById('fieldFilter')?.addEventListener('change', applyFilters);
    document.getElementById('cropFilter')?.addEventListener('change', applyFilters);
    document.getElementById('statusFilter')?.addEventListener('change', applyFilters);
    document.getElementById('dateFilter')?.addEventListener('change', applyFilters);
    document.getElementById('resetFilters')?.addEventListener('click', resetFilters);
    
    // Export buttons
    document.getElementById('exportCSV')?.addEventListener('click', exportToCSV);
    document.getElementById('exportPDF')?.addEventListener('click', exportToPDF);
    
    // Chart period buttons
    document.querySelectorAll('.chart-controls .btn-small').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.chart-controls .btn-small').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const period = parseInt(this.dataset.period);
            updateUsageTrendChart(period);
        });
    });
    
    // Refresh button
    document.getElementById('refreshBtn')?.addEventListener('click', refreshAllData);
    
    // Calculator toggle
    const calculatorToggle = document.querySelector('.calculator-section .section-toggle');
    calculatorToggle?.addEventListener('click', toggleCalculator);
}

// Load Dashboard Stats
async function loadDashboardStats() {
    try {
        // Mock data - replace with actual API call
        const stats = {
            totalWaterToday: 24750,
            targetWater: 30000,
            avgUsage: 28.4,
            totalCost: 1485,
            efficiency: 87
        };
        
        // Update stat cards
        document.getElementById('totalWaterValue').textContent = formatNumber(stats.totalWaterToday) + ' L';
        document.getElementById('dailyProgress').style.width = ((stats.totalWaterToday / stats.targetWater) * 100) + '%';
        document.getElementById('dailyProgressText').textContent = `${Math.round((stats.totalWaterToday / stats.targetWater) * 100)}% of daily target (${formatNumber(stats.targetWater)}L)`;
        
        document.getElementById('avgUsageValue').textContent = stats.avgUsage + ' L/m²';
        document.getElementById('totalCostValue').textContent = '₹' + formatNumber(stats.totalCost);
        document.getElementById('efficiencyValue').textContent = stats.efficiency + '%';
        
        // Update trend indicators
        document.getElementById('waterTrend').innerHTML = '<i class="fas fa-arrow-up"></i> 12% vs yesterday';
        document.getElementById('usageTrend').innerHTML = '<i class="fas fa-arrow-down"></i> 5% vs yesterday';
        document.getElementById('costTrend').innerHTML = '<i class="fas fa-arrow-up"></i> 8% vs yesterday';
        document.getElementById('efficiencyTrend').innerHTML = '<i class="fas fa-arrow-up"></i> 3% vs yesterday';
        
    } catch (error) {
        console.error('Error loading dashboard stats:', error);
    }
}

// Load Source Levels
async function loadSourceLevels() {
    try {
        // Mock data - replace with actual API call
        const sources = [
            { id: 'tankLevel', level: 75, current: 6000, total: 8000 },
            { id: 'borewellLevel', level: 45, current: 2250, total: 5000 },
            { id: 'rainwaterLevel', level: 90, current: 5400, total: 6000 },
            { id: 'canalLevel', level: 60, current: 4800, total: 8000 }
        ];
        
        sources.forEach(source => {
            const levelElement = document.getElementById(source.id);
            if (levelElement) {
                levelElement.style.height = source.level + '%';
                levelElement.setAttribute('data-level', source.level);
            }
        });
        
    } catch (error) {
        console.error('Error loading source levels:', error);
    }
}

// Load Water Usage Data
async function loadWaterUsageData() {
    try {
        // Mock data - replace with actual API call
        waterUsageData = [
            {
                id: 1,
                fieldName: 'Field A-01',
                cropType: 'Wheat',
                date: '2024-01-15',
                waterUsed: 5200,
                startTime: '06:00',
                endTime: '08:30',
                flowRate: 45.5,
                status: 'optimal',
                cost: 312,
                source: 'Tank'
            },
            {
                id: 2,
                fieldName: 'Field B-03',
                cropType: 'Rice',
                date: '2024-01-15',
                waterUsed: 8500,
                startTime: '05:30',
                endTime: '09:00',
                flowRate: 48.2,
                status: 'optimal',
                cost: 510,
                source: 'Borewell'
            },
            {
                id: 3,
                fieldName: 'Field C-02',
                cropType: 'Corn',
                date: '2024-01-15',
                waterUsed: 3200,
                startTime: '07:00',
                endTime: '08:45',
                flowRate: 42.0,
                status: 'underused',
                cost: 192,
                source: 'Rainwater'
            },
            {
                id: 4,
                fieldName: 'Field A-02',
                cropType: 'Cotton',
                date: '2024-01-14',
                waterUsed: 6800,
                startTime: '06:15',
                endTime: '09:30',
                flowRate: 50.5,
                status: 'overused',
                cost: 408,
                source: 'Canal'
            },
            {
                id: 5,
                fieldName: 'Field D-01',
                cropType: 'Tomato',
                date: '2024-01-14',
                waterUsed: 4500,
                startTime: '08:00',
                endTime: '10:15',
                flowRate: 44.0,
                status: 'optimal',
                cost: 270,
                source: 'Tank'
            },
            {
                id: 6,
                fieldName: 'Field B-01',
                cropType: 'Wheat',
                date: '2024-01-14',
                waterUsed: 5400,
                startTime: '06:30',
                endTime: '09:00',
                flowRate: 46.8,
                status: 'optimal',
                cost: 324,
                source: 'Borewell'
            },
            {
                id: 7,
                fieldName: 'Field C-05',
                cropType: 'Rice',
                date: '2024-01-13',
                waterUsed: 9200,
                startTime: '05:00',
                endTime: '09:15',
                flowRate: 52.0,
                status: 'overused',
                cost: 552,
                source: 'Canal'
            },
            {
                id: 8,
                fieldName: 'Field A-03',
                cropType: 'Corn',
                date: '2024-01-13',
                waterUsed: 3800,
                startTime: '07:30',
                endTime: '09:45',
                flowRate: 43.2,
                status: 'optimal',
                cost: 228,
                source: 'Rainwater'
            },
            {
                id: 9,
                fieldName: 'Field D-02',
                cropType: 'Cotton',
                date: '2024-01-13',
                waterUsed: 6200,
                startTime: '06:00',
                endTime: '09:00',
                flowRate: 48.5,
                status: 'optimal',
                cost: 372,
                source: 'Tank'
            },
            {
                id: 10,
                fieldName: 'Field B-02',
                cropType: 'Tomato',
                date: '2024-01-12',
                waterUsed: 4200,
                startTime: '08:15',
                endTime: '10:30',
                flowRate: 41.5,
                status: 'underused',
                cost: 252,
                source: 'Borewell'
            }
        ];
        
        filteredData = [...waterUsageData];
        renderTable();
        updateCharts();
        
    } catch (error) {
        console.error('Error loading water usage data:', error);
        showError('Failed to load water usage data');
    }
}

// Render Table
function renderTable() {
    const tbody = document.getElementById('usageTableBody');
    if (!tbody) return;
    
    const start = (currentPage - 1) * recordsPerPage;
    const end = start + recordsPerPage;
    const pageData = filteredData.slice(start, end);
    
    if (pageData.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="9" class="empty-state">
                    <i class="fas fa-inbox"></i>
                    <h3>No records found</h3>
                    <p>Try adjusting your filters or add a new record</p>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = pageData.map(record => {
        const duration = calculateDuration(record.startTime, record.endTime);
        const statusClass = `status-${record.status}`;
        const statusIcon = record.status === 'optimal' ? 'check-circle' : 
                          record.status === 'overused' ? 'exclamation-circle' : 'info-circle';
        
        return `
            <tr>
                <td><strong>${record.fieldName}</strong></td>
                <td>${record.cropType}</td>
                <td>${formatDate(record.date)}</td>
                <td><strong>${formatNumber(record.waterUsed)} L</strong></td>
                <td>${duration}</td>
                <td>${record.flowRate} L/min</td>
                <td>
                    <span class="status-badge ${statusClass}">
                        <i class="fas fa-${statusIcon}"></i>
                        ${record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                    </span>
                </td>
                <td>₹${formatNumber(record.cost)}</td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn edit" onclick="editRecord(${record.id})" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete" onclick="deleteRecord(${record.id})" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
    
    renderPagination();
}

// Render Pagination
function renderPagination() {
    const pagination = document.getElementById('tablePagination');
    if (!pagination) return;
    
    const totalPages = Math.ceil(filteredData.length / recordsPerPage);
    
    let html = '';
    
    // Previous button
    html += `<button class="page-btn" ${currentPage === 1 ? 'disabled' : ''} onclick="changePage(${currentPage - 1})">
        <i class="fas fa-chevron-left"></i>
    </button>`;
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">${i}</button>`;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            html += `<button class="page-btn" disabled>...</button>`;
        }
    }
    
    // Next button
    html += `<button class="page-btn" ${currentPage === totalPages ? 'disabled' : ''} onclick="changePage(${currentPage + 1})">
        <i class="fas fa-chevron-right"></i>
    </button>`;
    
    pagination.innerHTML = html;
}

// Change Page
function changePage(page) {
    const totalPages = Math.ceil(filteredData.length / recordsPerPage);
    if (page < 1 || page > totalPages) return;
    currentPage = page;
    renderTable();
}

// Apply Filters
function applyFilters() {
    const searchTerm = document.getElementById('searchField')?.value.toLowerCase() || '';
    const fieldFilter = document.getElementById('fieldFilter')?.value || 'all';
    const cropFilter = document.getElementById('cropFilter')?.value || 'all';
    const statusFilter = document.getElementById('statusFilter')?.value || 'all';
    const dateFilter = document.getElementById('dateFilter')?.value || '';
    
    filteredData = waterUsageData.filter(record => {
        const matchesSearch = record.fieldName.toLowerCase().includes(searchTerm) || 
                            record.cropType.toLowerCase().includes(searchTerm);
        const matchesField = fieldFilter === 'all' || record.fieldName.toLowerCase().includes(fieldFilter);
        const matchesCrop = cropFilter === 'all' || record.cropType.toLowerCase() === cropFilter.toLowerCase();
        const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
        const matchesDate = !dateFilter || record.date === dateFilter;
        
        return matchesSearch && matchesField && matchesCrop && matchesStatus && matchesDate;
    });
    
    currentPage = 1;
    renderTable();
}

// Reset Filters
function resetFilters() {
    document.getElementById('searchField').value = '';
    document.getElementById('fieldFilter').value = 'all';
    document.getElementById('cropFilter').value = 'all';
    document.getElementById('statusFilter').value = 'all';
    document.getElementById('dateFilter').value = '';
    
    filteredData = [...waterUsageData];
    currentPage = 1;
    renderTable();
}

// Initialize Charts
function initializeCharts() {
    // Usage Trend Chart
    const trendCtx = document.getElementById('usageTrendChart');
    if (trendCtx) {
        usageTrendChart = new Chart(trendCtx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Water Usage (L)',
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
                                return 'Water: ' + formatNumber(context.parsed.y) + ' L';
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return formatNumber(value) + 'L';
                            }
                        }
                    }
                }
            }
        });
        
        updateUsageTrendChart(7);
    }
    
    // Distribution Chart
    const distCtx = document.getElementById('distributionChart');
    if (distCtx) {
        distributionChart = new Chart(distCtx, {
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
                        '#F44336'
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
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return label + ': ' + formatNumber(value) + 'L (' + percentage + '%)';
                            }
                        }
                    }
                }
            }
        });
        
        updateDistributionChart();
    }
}

// Update Usage Trend Chart
function updateUsageTrendChart(days) {
    if (!usageTrendChart) return;
    
    // Generate mock data for the specified period
    const labels = [];
    const data = [];
    
    for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        
        // Calculate total for this date
        const dateStr = date.toISOString().split('T')[0];
        const total = waterUsageData
            .filter(r => r.date === dateStr)
            .reduce((sum, r) => sum + r.waterUsed, 0);
        data.push(total || Math.floor(Math.random() * 30000) + 10000);
    }
    
    usageTrendChart.data.labels = labels;
    usageTrendChart.data.datasets[0].data = data;
    usageTrendChart.update();
}

// Update Distribution Chart
function updateDistributionChart() {
    if (!distributionChart) return;
    
    // Group by crop type
    const distribution = {};
    waterUsageData.forEach(record => {
        distribution[record.cropType] = (distribution[record.cropType] || 0) + record.waterUsed;
    });
    
    distributionChart.data.labels = Object.keys(distribution);
    distributionChart.data.datasets[0].data = Object.values(distribution);
    distributionChart.update();
}

// Update Charts
function updateCharts() {
    updateUsageTrendChart(7);
    updateDistributionChart();
}

// Modal Functions
function openAddModal() {
    editingRecordId = null;
    document.getElementById('modalTitle').textContent = 'Add Water Usage Record';
    document.getElementById('usageForm').reset();
    document.getElementById('recordId').value = '';
    document.getElementById('usageModal').classList.add('active');
}

function openEditModal(record) {
    editingRecordId = record.id;
    document.getElementById('modalTitle').textContent = 'Edit Water Usage Record';
    document.getElementById('recordId').value = record.id;
    document.getElementById('fieldName').value = record.fieldName;
    document.getElementById('cropType').value = record.cropType;
    document.getElementById('usageDate').value = record.date;
    document.getElementById('waterUsed').value = record.waterUsed;
    document.getElementById('startTime').value = record.startTime;
    document.getElementById('endTime').value = record.endTime;
    document.getElementById('flowRate').value = record.flowRate;
    document.getElementById('waterSource').value = record.source;
    document.getElementById('notes').value = record.notes || '';
    document.getElementById('usageModal').classList.add('active');
}

function closeUsageModal() {
    document.getElementById('usageModal').classList.remove('active');
    editingRecordId = null;
}

function closeDeleteModal() {
    document.getElementById('deleteModal').classList.remove('active');
    editingRecordId = null;
}

// CRUD Operations
function editRecord(id) {
    const record = waterUsageData.find(r => r.id === id);
    if (record) {
        openEditModal(record);
    }
}

function deleteRecord(id) {
    editingRecordId = id;
    document.getElementById('deleteModal').classList.add('active');
}

function confirmDelete() {
    if (!editingRecordId) return;
    
    // Remove from data
    waterUsageData = waterUsageData.filter(r => r.id !== editingRecordId);
    filteredData = filteredData.filter(r => r.id !== editingRecordId);
    
    renderTable();
    updateCharts();
    closeDeleteModal();
    showSuccess('Record deleted successfully');
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = {
        id: editingRecordId || Date.now(),
        fieldName: document.getElementById('fieldName').value,
        cropType: document.getElementById('cropType').value,
        date: document.getElementById('usageDate').value,
        waterUsed: parseInt(document.getElementById('waterUsed').value),
        startTime: document.getElementById('startTime').value,
        endTime: document.getElementById('endTime').value,
        flowRate: parseFloat(document.getElementById('flowRate').value) || 0,
        source: document.getElementById('waterSource').value,
        notes: document.getElementById('notes').value,
        status: 'optimal', // Calculate based on criteria
        cost: calculateCost(parseInt(document.getElementById('waterUsed').value))
    };
    
    if (editingRecordId) {
        // Update existing record
        const index = waterUsageData.findIndex(r => r.id === editingRecordId);
        if (index !== -1) {
            waterUsageData[index] = formData;
            showSuccess('Record updated successfully');
        }
    } else {
        // Add new record
        waterUsageData.unshift(formData);
        showSuccess('Record added successfully');
    }
    
    filteredData = [...waterUsageData];
    renderTable();
    updateCharts();
    closeUsageModal();
}

// Export Functions
function exportToCSV() {
    const headers = ['Field Name', 'Crop Type', 'Date', 'Water Used (L)', 'Duration', 'Flow Rate', 'Status', 'Cost'];
    const rows = filteredData.map(record => [
        record.fieldName,
        record.cropType,
        record.date,
        record.waterUsed,
        calculateDuration(record.startTime, record.endTime),
        record.flowRate,
        record.status,
        record.cost
    ]);
    
    let csv = headers.join(',') + '\n';
    rows.forEach(row => {
        csv += row.join(',') + '\n';
    });
    
    downloadFile(csv, 'water-usage-' + new Date().toISOString().split('T')[0] + '.csv', 'text/csv');
    showSuccess('Data exported to CSV successfully');
}

function exportToPDF() {
    // Mock PDF export - implement with a library like jsPDF
    showSuccess('PDF export functionality will be implemented');
}

// Utility Functions
function calculateDuration(startTime, endTime) {
    const start = new Date('2000-01-01 ' + startTime);
    const end = new Date('2000-01-01 ' + endTime);
    const diff = (end - start) / 1000 / 60; // minutes
    const hours = Math.floor(diff / 60);
    const minutes = diff % 60;
    return `${hours}h ${minutes}m`;
}

function calculateCost(waterUsed) {
    const costPerLiter = 0.06; // ₹0.06 per liter
    return Math.round(waterUsed * costPerLiter);
}

function formatNumber(num) {
    return new Intl.NumberFormat('en-IN').format(num);
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function setTodayDate() {
    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('usageDate');
    if (dateInput && !dateInput.value) {
        dateInput.value = today;
    }
}

function downloadFile(content, filename, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function showSuccess(message) {
    // Implement toast notification
    console.log('✓ ' + message);
}

function showError(message) {
    // Implement toast notification
    console.error('✗ ' + message);
}

function refreshAllData() {
    loadDashboardStats();
    loadSourceLevels();
    loadWaterUsageData();
    showSuccess('Data refreshed successfully');
}

function setupRealTimeUpdates() {
    // Update dashboard every 30 seconds
    setInterval(() => {
        loadDashboardStats();
        loadSourceLevels();
    }, 30000);
}

function toggleCalculator() {
    const section = document.getElementById('calculatorSection');
    section.classList.toggle('collapsed');
}

// Calculator functions (from original)
function calculateWaterUsage() {
    // Implement calculator logic
    document.getElementById('resultsSection').style.display = 'block';
}

function resetForm() {
    document.querySelector('.analysis-form').reset();
    document.getElementById('resultsSection').style.display = 'none';
}

function modifyCalculation() {
    document.getElementById('resultsSection').style.display = 'none';
}

function addToSchedule() {
    // Implement add to schedule logic
    showSuccess('Added to irrigation schedule');
}
