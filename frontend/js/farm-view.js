document.addEventListener('DOMContentLoaded', function() {
    // Initialize charts
    initializeCharts();
    
    // Initialize schedule
    initializeSchedule();
    
    // Initialize zones
    initializeZones();

    // Add event listeners
    setupEventListeners();
});

function initializeCharts() {
    // Crop Performance Chart
    const cropCtx = document.getElementById('cropPerformanceChart').getContext('2d');
    new Chart(cropCtx, {
        type: 'line',
        data: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
            datasets: [
                {
                    label: 'Wheat',
                    data: [65, 70, 75, 78, 82, 85],
                    borderColor: 'rgb(255, 99, 132)',
                    tension: 0.1
                },
                {
                    label: 'Corn',
                    data: [70, 72, 76, 80, 84, 88],
                    borderColor: 'rgb(54, 162, 235)',
                    tension: 0.1
                },
                {
                    label: 'Soybeans',
                    data: [60, 65, 68, 72, 75, 78],
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Growth Progress (%)'
                    }
                }
            }
        }
    });

    // Water Consumption Chart
    const waterCtx = document.getElementById('waterConsumptionChart').getContext('2d');
    new Chart(waterCtx, {
        type: 'bar',
        data: {
            labels: ['Zone 1', 'Zone 2', 'Zone 3', 'Zone 4'],
            datasets: [{
                label: 'Daily Water Usage (Gallons)',
                data: [450, 650, 400, 550],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(75, 192, 192, 0.5)'
                ],
                borderColor: [
                    'rgb(255, 99, 132)',
                    'rgb(54, 162, 235)',
                    'rgb(255, 206, 86)',
                    'rgb(75, 192, 192)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function initializeSchedule() {
    const scheduleData = [
        {
            zone: 'Zone 1',
            crop: 'Wheat',
            startTime: '06:00 AM',
            duration: '45 min',
            status: 'Completed'
        },
        {
            zone: 'Zone 2',
            crop: 'Corn',
            startTime: '09:00 AM',
            duration: '30 min',
            status: 'In Progress'
        },
        {
            zone: 'Zone 3',
            crop: 'Soybeans',
            startTime: '02:00 PM',
            duration: '40 min',
            status: 'Scheduled'
        }
    ];

    const tableBody = document.getElementById('scheduleTableBody');
    
    scheduleData.forEach(schedule => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${schedule.zone}</td>
            <td>${schedule.crop}</td>
            <td>${schedule.startTime}</td>
            <td>${schedule.duration}</td>
            <td>
                <span class="status-badge ${schedule.status.toLowerCase().replace(' ', '-')}">
                    ${schedule.status}
                </span>
            </td>
            <td>
                <button class="btn-edit" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-delete" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function initializeZones() {
    const zonesData = [
        {
            name: 'Zone 1 - Wheat Field',
            status: 'Active',
            moisture: '75%',
            lastWatered: '2 hours ago'
        },
        {
            name: 'Zone 2 - Corn Field',
            status: 'Scheduled',
            moisture: '68%',
            lastWatered: '5 hours ago'
        },
        {
            name: 'Zone 3 - Soybean Field',
            status: 'Inactive',
            moisture: '72%',
            lastWatered: '3 hours ago'
        },
        {
            name: 'Zone 4 - Rice Field',
            status: 'Active',
            moisture: '80%',
            lastWatered: '1 hour ago'
        }
    ];

    const zonesGrid = document.getElementById('zonesGrid');
    
    zonesData.forEach(zone => {
        const zoneCard = document.createElement('div');
        zoneCard.className = `zone-card ${zone.status.toLowerCase()}`;
        zoneCard.innerHTML = `
            <div class="zone-header">
                <span class="zone-name">${zone.name}</span>
                <span class="zone-status ${zone.status.toLowerCase()}">${zone.status}</span>
            </div>
            <div class="zone-info">
                <p>Soil Moisture: ${zone.moisture}</p>
                <p>Last Watered: ${zone.lastWatered}</p>
            </div>
            <div class="zone-controls">
                <button class="zone-btn ${zone.status === 'Active' ? 'active' : ''}" data-action="toggle">
                    <i class="fas fa-power-off"></i>
                    ${zone.status === 'Active' ? 'Stop' : 'Start'}
                </button>
                <button class="zone-btn" data-action="settings">
                    <i class="fas fa-cog"></i>
                    Settings
                </button>
            </div>
        `;
        zonesGrid.appendChild(zoneCard);
    });
}

function setupEventListeners() {
    // Add Schedule Button
    const addScheduleBtn = document.querySelector('.btn-add-schedule');
    if (addScheduleBtn) {
        addScheduleBtn.addEventListener('click', () => {
            // Implement add schedule functionality
            alert('Add Schedule functionality will be implemented here');
        });
    }

    // Emergency Stop Button
    const emergencyBtn = document.querySelector('.btn-emergency');
    if (emergencyBtn) {
        emergencyBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to stop all irrigation systems?')) {
                // Implement emergency stop functionality
                alert('Emergency stop activated - All systems stopped');
            }
        });
    }

    // Zone Control Buttons
    const zoneButtons = document.querySelectorAll('.zone-btn[data-action="toggle"]');
    zoneButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const zoneCard = e.target.closest('.zone-card');
            const zoneName = zoneCard.querySelector('.zone-name').textContent;
            const isActive = button.classList.contains('active');
            
            if (isActive) {
                button.classList.remove('active');
                button.innerHTML = '<i class="fas fa-power-off"></i> Start';
                zoneCard.classList.remove('active');
                alert(`Irrigation stopped for ${zoneName}`);
            } else {
                button.classList.add('active');
                button.innerHTML = '<i class="fas fa-power-off"></i> Stop';
                zoneCard.classList.add('active');
                alert(`Irrigation started for ${zoneName}`);
            }
        });
    });

    // Zone Settings Buttons
    const settingsButtons = document.querySelectorAll('.zone-btn[data-action="settings"]');
    settingsButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const zoneName = e.target.closest('.zone-card').querySelector('.zone-name').textContent;
            alert(`Settings panel for ${zoneName} will be implemented here`);
        });
    });
}