// API Configuration
const API_BASE_URL = 'http://localhost:8000/api';
const OPENWEATHER_API_KEY = ''; // Will be passed from backend

// Initialize Weather Map
let weatherMap;
let weatherLayer;

function initializeWeatherMap() {
    weatherMap = L.map('weatherMap').setView([20.5937, 78.9629], 5); // Center on India
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(weatherMap);
}

// Weather Functions
async function updateWeather(lat, lon) {
    try {
        const response = await fetch(`${API_BASE_URL}/farming/weather/${lat}/${lon}`);
        const data = await response.json();
        
        // Update weather card
        document.querySelector('.temperature').textContent = `${data.temperature}°C`;
        document.querySelector('.humidity').textContent = `Humidity: ${data.humidity}%`;
        document.querySelector('.wind').textContent = `Wind: ${data.wind_speed} km/h`;
        
        // Update weather icon based on description
        updateWeatherIcon(data.description);
        
    } catch (error) {
        console.error('Error fetching weather:', error);
    }
}

function updateWeatherIcon(description) {
    const iconElement = document.querySelector('.weather-icon i');
    iconElement.className = 'fas';
    
    if (description.includes('rain')) {
        iconElement.classList.add('fa-cloud-rain');
    } else if (description.includes('cloud')) {
        iconElement.classList.add('fa-cloud');
    } else if (description.includes('clear')) {
        iconElement.classList.add('fa-sun');
    } else {
        iconElement.classList.add('fa-cloud-sun');
    }
}

// Crop Water Calculator
document.getElementById('cropCalculator').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const cropType = document.getElementById('cropType').value;
    const landSize = document.getElementById('landSize').value;
    const landUnit = document.getElementById('landUnit').value;
    const soilType = document.getElementById('soilType').value;
    
    try {
        const response = await fetch(`${API_BASE_URL}/farming/calculate-water-requirement`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                crop_type: cropType,
                land_size: parseFloat(landSize),
                land_unit: landUnit,
                soil_type: soilType
            })
        });
        
        const data = await response.json();
        
        // Update result display
        document.querySelector('.result-value').textContent = 
            `${Math.round(data.daily_requirement_liters).toLocaleString()} Liters`;
        document.querySelector('.result-cubic').textContent = 
            `${data.daily_requirement_cubic_meters.toLocaleString()} Cubic Meters`;
        
    } catch (error) {
        console.error('Error calculating water requirement:', error);
    }
});

// Usage Charts
function initializeCharts() {
    // Water Usage Chart
    const waterCtx = document.getElementById('waterUsageChart').getContext('2d');
    const waterChart = new Chart(waterCtx, {
        type: 'bar',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Water Usage (m³)',
                data: [],
                backgroundColor: '#3498db'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

    // Electricity Usage Chart
    const electricityCtx = document.getElementById('electricityChart').getContext('2d');
    const electricityChart = new Chart(electricityCtx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Electricity (kWh)',
                data: [],
                borderColor: '#e74c3c',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

    // Pump Runtime Chart
    const pumpCtx = document.getElementById('pumpChart').getContext('2d');
    const pumpChart = new Chart(pumpCtx, {
        type: 'bar',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Runtime (hours)',
                data: [],
                backgroundColor: '#2ecc71'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

    return { waterChart, electricityChart, pumpChart };
}

async function updateCharts() {
    try {
        // Fetch last 7 days of data
        const endDate = new Date().toISOString().split('T')[0];
        const startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            .toISOString().split('T')[0];
        
        const [waterData, pumpData] = await Promise.all([
            fetch(`${API_BASE_URL}/farming/water-usage?start_date=${startDate}&end_date=${endDate}`),
            fetch(`${API_BASE_URL}/farming/pump-usage?start_date=${startDate}&end_date=${endDate}`)
        ]);
        
        // Update charts with new data
        const waterJson = await waterData.json();
        const pumpJson = await pumpData.json();
        
        charts.waterChart.data.datasets[0].data = waterJson.daily_usage;
        charts.electricityChart.data.datasets[0].data = pumpJson.daily_electricity;
        charts.pumpChart.data.datasets[0].data = pumpJson.daily_hours;
        
        charts.waterChart.update();
        charts.electricityChart.update();
        charts.pumpChart.update();
        
    } catch (error) {
        console.error('Error updating charts:', error);
    }
}

// Pump Controls
let pumpRunning = false;

document.getElementById('startPump').addEventListener('click', async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/farming/pump/start`, {
            method: 'POST'
        });
        
        if (response.ok) {
            pumpRunning = true;
            updatePumpStatus();
        }
    } catch (error) {
        console.error('Error starting pump:', error);
    }
});

document.getElementById('stopPump').addEventListener('click', async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/farming/pump/stop`, {
            method: 'POST'
        });
        
        if (response.ok) {
            pumpRunning = false;
            updatePumpStatus();
        }
    } catch (error) {
        console.error('Error stopping pump:', error);
    }
});

function updatePumpStatus() {
    const statusText = document.querySelector('.status-text');
    const startBtn = document.getElementById('startPump');
    const stopBtn = document.getElementById('stopPump');
    
    statusText.textContent = pumpRunning ? 'RUNNING' : 'IDLE';
    statusText.style.color = pumpRunning ? 'var(--safe-color)' : 'var(--text-color)';
    
    startBtn.disabled = pumpRunning;
    stopBtn.disabled = !pumpRunning;
}

// Alerts Handling
function addAlert(message, type = 'warning') {
    const alertsList = document.getElementById('alertsList');
    const alertElement = document.createElement('div');
    alertElement.className = `alert-item ${type}`;
    alertElement.textContent = message;
    
    alertsList.insertBefore(alertElement, alertsList.firstChild);
    
    // Remove old alerts if there are more than 5
    while (alertsList.children.length > 5) {
        alertsList.removeChild(alertsList.lastChild);
    }
}

// Schedule Management
function updateSchedule(scheduleData) {
    const tbody = document.querySelector('#irrigationSchedule tbody');
    tbody.innerHTML = '';
    
    scheduleData.forEach(entry => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${entry.time}</td>
            <td>${entry.duration} minutes</td>
            <td>${entry.water_amount} m³</td>
            <td>${entry.status}</td>
        `;
        tbody.appendChild(row);
    });
}

// Initialize everything
let charts;

document.addEventListener('DOMContentLoaded', () => {
    initializeWeatherMap();
    charts = initializeCharts();
    
    // Get user's location for weather
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            updateWeather(position.coords.latitude, position.coords.longitude);
        });
    }
    
    // Start periodic updates
    updateCharts();
    setInterval(updateCharts, 300000); // Update every 5 minutes
    
    // Check for leaks every minute
    setInterval(async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/farming/leakage-detection`);
            const data = await response.json();
            
            if (data.has_leakage) {
                data.anomalies.forEach(anomaly => {
                    addAlert(`Leak detected: ${anomaly.type} at ${anomaly.timestamp}`, 'danger');
                });
            }
        } catch (error) {
            console.error('Error checking for leaks:', error);
        }
    }, 60000);
});