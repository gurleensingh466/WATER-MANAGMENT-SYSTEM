// Initialize the map
let map;
let weatherChart;
let qualityChart;
let dashboardCards = {};

document.addEventListener('DOMContentLoaded', function() {
    initializeMap();
    initializeCharts();
    setupEventListeners();
    fetchWeatherData();
    updateCropWaterNeeds();
    loadDashboardCards();
    initializeCropManagement();
});

// Dashboard Card Management
function loadDashboardCards() {
    // Load cards data from localStorage or use defaults
    const savedCards = localStorage.getItem('dashboardCards');
    if (savedCards) {
        dashboardCards = JSON.parse(savedCards);
    } else {
        dashboardCards = {
            'water-usage': { value: '12,450 L', progress: 68, trend: '12% from yesterday' },
            'active-fields': { value: '12/15', progress: 80, trend: '3 fields harvested' },
            'moisture-avg': { value: '58%', progress: 58, trend: 'Within normal range' },
            'pending-irrigation': { value: '5', progress: 38, trend: '2 urgent' },
            'weather-update': { value: 'Partly Cloudy', temp: '25°C', humidity: '65%' },
            'power-consumption': { value: '23.5 kWh', progress: 47, trend: '5% less than yesterday' }
        };
        saveDashboardCards();
    }
    updateCardDisplays();
}

function saveDashboardCards() {
    localStorage.setItem('dashboardCards', JSON.stringify(dashboardCards));
}

function updateCardDisplays() {
    // Update water usage
    if (dashboardCards['water-usage']) {
        const card = dashboardCards['water-usage'];
        document.getElementById('waterUsedToday').textContent = card.value;
    }
    
    // Update active fields
    if (dashboardCards['active-fields']) {
        const card = dashboardCards['active-fields'];
        document.getElementById('activeFields').textContent = card.value;
    }
    
    // Update moisture average
    if (dashboardCards['moisture-avg']) {
        const card = dashboardCards['moisture-avg'];
        document.getElementById('moistureAvg').textContent = card.value;
    }
    
    // Update pending irrigations
    if (dashboardCards['pending-irrigation']) {
        const card = dashboardCards['pending-irrigation'];
        document.getElementById('pendingIrrigation').textContent = card.value;
    }
    
    // Update weather
    if (dashboardCards['weather-update']) {
        const card = dashboardCards['weather-update'];
        document.getElementById('currentWeather').textContent = card.value;
    }
    
    // Update power consumption
    if (dashboardCards['power-consumption']) {
        const card = dashboardCards['power-consumption'];
        document.getElementById('powerConsumption').textContent = card.value;
    }
}

function editCard(cardId) {
    const card = dashboardCards[cardId];
    if (!card) return;
    
    const cardElement = document.querySelector(`[data-card-id="${cardId}"]`);
    const cardTitle = cardElement.querySelector('.card-title').textContent;
    const currentValue = cardElement.querySelector('.card-value').textContent;
    
    const newValue = prompt(`Edit ${cardTitle}\nCurrent value: ${currentValue}\n\nEnter new value:`);
    
    if (newValue !== null && newValue.trim() !== '') {
        card.value = newValue.trim();
        saveDashboardCards();
        updateCardDisplays();
        showNotification(`${cardTitle} updated successfully!`, 'success');
    }
}

function deleteCard(cardId) {
    const cardElement = document.querySelector(`[data-card-id="${cardId}"]`);
    const cardTitle = cardElement.querySelector('.card-title').textContent;
    
    if (confirm(`Are you sure you want to delete the "${cardTitle}" card?\n\nThis action cannot be undone.`)) {
        cardElement.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            cardElement.remove();
            delete dashboardCards[cardId];
            saveDashboardCards();
            showNotification(`${cardTitle} card deleted successfully!`, 'success');
        }, 300);
    }
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = 'notification show';
    notification.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        background: ${type === 'success' ? 'linear-gradient(135deg, #4CAF50, #388E3C)' : 'linear-gradient(135deg, #F44336, #D32F2F)'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 1rem;
        box-shadow: 0 10px 15px rgba(0,0,0,0.1);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
    `;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
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
            transform: translateX(400px);
            opacity: 0;
        }
    }
    
    @keyframes fadeOut {
        from {
            opacity: 1;
            transform: scale(1);
        }
        to {
            opacity: 0;
            transform: scale(0.8);
        }
    }
`;
document.head.appendChild(style);

function initializeMap() {
    // Initialize the map with a default center (replace with your farm's coordinates)
    map = L.map('farmMap').setView([51.505, -0.09], 13);
    
    // Add the OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Add farm boundary (example polygon)
    const farmBoundary = L.polygon([
        [51.509, -0.08],
        [51.503, -0.06],
        [51.501, -0.09]
    ], {
        color: '#2196F3',
        fillColor: '#64B5F6',
        fillOpacity: 0.3
    }).addTo(map);

    // Add markers for sensors
    addSensorMarkers();
}

function addSensorMarkers() {
    // Example sensor locations
    const sensors = [
        { lat: 51.505, lng: -0.09, type: 'water' },
        { lat: 51.507, lng: -0.08, type: 'weather' },
        // Add more sensors as needed
    ];

    sensors.forEach(sensor => {
        const icon = L.divIcon({
            className: `sensor-marker ${sensor.type}`,
            html: `<i class="fas fa-${sensor.type === 'water' ? 'tint' : 'cloud'}"></i>`,
            iconSize: [30, 30]
        });

        L.marker([sensor.lat, sensor.lng], { icon }).addTo(map);
    });
}

function initializeCharts() {
    // Water Quality Chart
    const qualityCtx = document.getElementById('waterQualityChart').getContext('2d');
    qualityChart = new Chart(qualityCtx, {
        type: 'line',
        data: {
            labels: Array.from({length: 24}, (_, i) => `${i}:00`),
            datasets: [{
                label: 'pH Level',
                data: generateRandomData(24, 6.5, 8.5),
                borderColor: '#2196F3',
                tension: 0.4,
                fill: false
            }, {
                label: 'TDS (ppm)',
                data: generateRandomData(24, 400, 500),
                borderColor: '#4CAF50',
                tension: 0.4,
                fill: false
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
                    beginAtZero: false
                }
            }
        }
    });
}

function generateRandomData(points, min, max) {
    return Array.from({length: points}, () => 
        Math.round((Math.random() * (max - min) + min) * 10) / 10
    );
}

function setupEventListeners() {
    // Period selection for water quality chart
    document.querySelectorAll('.box-actions .btn-action[data-period]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.btn-action[data-period]').forEach(b => 
                b.classList.remove('active'));
            e.target.classList.add('active');
            updateChartPeriod(e.target.dataset.period);
        });
    });

    // Map controls
    document.getElementById('refreshMap').addEventListener('click', refreshMapData);
    document.getElementById('expandMap').addEventListener('click', toggleMapFullscreen);

    // Crop selection
    document.querySelector('.crop-select').addEventListener('change', updateCropWaterNeeds);
}

function updateChartPeriod(period) {
    // Update chart data based on selected period
    const periods = {
        day: 24,
        week: 7,
        month: 30
    };

    qualityChart.data.labels = Array.from(
        {length: periods[period]}, 
        (_, i) => period === 'day' ? `${i}:00` : `Day ${i + 1}`
    );
    qualityChart.data.datasets.forEach(dataset => {
        dataset.data = generateRandomData(periods[period], 6.5, 8.5);
    });
    qualityChart.update();
}

function refreshMapData() {
    // Simulate refreshing map data
    const button = document.getElementById('refreshMap');
    button.classList.add('rotating');
    setTimeout(() => {
        button.classList.remove('rotating');
        // Update sensors data here
    }, 1000);
}

function toggleMapFullscreen() {
    const mapContainer = document.querySelector('.map-container');
    mapContainer.classList.toggle('fullscreen');
    map.invalidateSize();
}

async function fetchWeatherData() {
    try {
        // Simulate weather API call
        const weatherData = {
            current: {
                temp: 22,
                condition: 'Sunny',
                icon: 'sun'
            },
            forecast: [
                { temp: 23, icon: 'sun' },
                { temp: 20, icon: 'cloud' },
                { temp: 19, icon: 'cloud-rain' }
            ]
        };

        updateWeatherDisplay(weatherData);
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

function updateWeatherDisplay(data) {
    // Update current weather
    document.querySelector('.current-weather i').className = `fas fa-${data.current.icon}`;
    document.querySelector('.weather-details .temp').textContent = `${data.current.temp}°C`;
    document.querySelector('.weather-details .condition').textContent = data.current.condition;

    // Update weather in quick stats
    document.getElementById('tempValue').textContent = `${data.current.temp}°C`;
    document.getElementById('weatherStatus').textContent = data.current.condition;

    // Update water requirements based on weather
    updateWaterRequirements(data);
}

function updateWaterRequirements(weatherData) {
    // Simple logic to calculate water requirements based on weather
    // In a real application, this would be more complex
    let baseRequirement = 2.5; // Base requirement in L/m²
    const temp = weatherData.current.temp;
    
    if (temp > 25) {
        baseRequirement *= 1.3; // Increase water needs in hot weather
    } else if (temp < 15) {
        baseRequirement *= 0.7; // Decrease water needs in cool weather
    }

    document.getElementById('waterRequired').textContent = `${baseRequirement.toFixed(1)}L/m²`;
}

// Crop Management
const cropData = {
    wheat: {
        waterNeeds: {
            base: 2.5,
            tempMultiplier: 1.2,
            soilFactors: {
                loamy: 1.0,
                sandy: 1.3,
                clay: 0.8,
                silt: 1.1
            }
        },
        recommendedSoil: "loamy",
        weatherImpact: {
            hot: "Increase water by 20%",
            cold: "Reduce water by 10%",
            rainy: "Adjust irrigation schedule"
        }
    },
    rice: {
        waterNeeds: {
            base: 4.0,
            tempMultiplier: 1.3,
            soilFactors: {
                loamy: 1.1,
                sandy: 1.4,
                clay: 1.0,
                silt: 1.2
            }
        },
        recommendedSoil: "clay",
        weatherImpact: {
            hot: "Maintain standing water",
            cold: "Reduce water depth",
            rainy: "Monitor water level"
        }
    }
    // Add more crops as needed
};

function initializeCropManagement() {
    const addCropBtn = document.getElementById('addCropBtn');
    const cropModal = document.getElementById('cropModal');
    const modalClose = document.querySelector('.modal-close');
    const cropSearch = document.getElementById('cropSearch');

    addCropBtn.addEventListener('click', () => {
        cropModal.classList.add('active');
    });

    modalClose.addEventListener('click', () => {
        cropModal.classList.remove('active');
    });

    cropSearch.addEventListener('input', debounce(searchCrops, 300));

    // Initialize form handlers
    initializeCropForm();
}

function initializeCropForm() {
    const form = document.querySelector('.modal-content');
    const cropType = document.getElementById('cropType');
    const soilType = document.getElementById('soilType');
    const landArea = document.getElementById('landArea');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        addNewCrop({
            type: cropType.value,
            soil: soilType.value,
            area: {
                value: landArea.value,
                unit: document.getElementById('areaUnit').value
            }
        });
    });

    // Update recommendations when crop type changes
    cropType.addEventListener('change', updateSoilRecommendations);
}

function updateSoilRecommendations() {
    const cropType = document.getElementById('cropType').value;
    const soilType = document.getElementById('soilType');
    
    if (cropData[cropType]) {
        const recommendedSoil = cropData[cropType].recommendedSoil;
        Array.from(soilType.options).forEach(option => {
            if (option.value === recommendedSoil) {
                option.textContent = `${option.textContent} (Recommended)`;
            }
        });
    }
}

function calculateWaterNeeds(crop, soil, temperature, rainfall) {
    if (!cropData[crop]) return null;

    const { waterNeeds } = cropData[crop];
    let water = waterNeeds.base;

    // Adjust for temperature
    if (temperature > 30) {
        water *= waterNeeds.tempMultiplier;
    } else if (temperature < 15) {
        water *= (1 / waterNeeds.tempMultiplier);
    }

    // Adjust for soil type
    water *= waterNeeds.soilFactors[soil] || 1;

    // Adjust for rainfall
    if (rainfall > 0) {
        water = Math.max(0, water - (rainfall * 0.8));
    }

    return water.toFixed(1);
}

function addNewCrop(cropData) {
    const container = document.querySelector('.crop-cards-container');
    const waterNeeds = calculateWaterNeeds(
        cropData.type,
        cropData.soil,
        currentWeather.temperature,
        currentWeather.rainfall
    );

    const cardHTML = createCropCard(cropData, waterNeeds);
    container.insertAdjacentHTML('afterbegin', cardHTML);
}

function createCropCard(crop, waterNeeds) {
    // Generate HTML for crop card (implementation similar to the template in HTML)
    // Return the HTML string
}

function searchCrops(query) {
    const cards = document.querySelectorAll('.crop-detail-card');
    query = query.toLowerCase();

    cards.forEach(card => {
        const cropName = card.querySelector('.crop-title h3').textContent.toLowerCase();
        if (cropName.includes(query)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize crop management when document loads
document.addEventListener('DOMContentLoaded', function() {
    initializeMap();
    initializeCharts();
    setupEventListeners();
    fetchWeatherData();
    initializeCropManagement();
});