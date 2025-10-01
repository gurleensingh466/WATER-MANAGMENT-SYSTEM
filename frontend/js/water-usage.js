// Crop data with water requirements and other specifications
const cropData = {
    wheat: {
        waterNeeds: 4.5, // mm per day
        growingPeriod: 120, // days
        soilPreference: {
            loamy: 1.0,
            sandy: 1.2,
            clay: 0.9,
            silt: 1.1
        },
        seasonalAdjustment: {
            summer: 1.3,
            winter: 0.8,
            monsoon: 0.6
        }
    },
    rice: {
        waterNeeds: 8.0,
        growingPeriod: 90,
        soilPreference: {
            loamy: 1.1,
            sandy: 1.3,
            clay: 1.0,
            silt: 1.2
        },
        seasonalAdjustment: {
            summer: 1.4,
            winter: 0.9,
            monsoon: 0.7
        }
    },
    // Add more crops with their specifications
};

const irrigationEfficiency = {
    drip: 0.9,      // 90% efficient
    sprinkler: 0.75, // 75% efficient
    flood: 0.5,      // 50% efficient
    furrow: 0.65     // 65% efficient
};

// Power consumption rates (kWh per liter)
const pumpPowerConsumption = 0.00185; // kWh per liter
const electricityRate = 0.12; // $ per kWh

document.addEventListener('DOMContentLoaded', function() {
    setupFormListeners();
    // Show currently active schedules if any
    loadExistingSchedules();
});

function setupFormListeners() {
    // Add change listeners to form inputs for real-time updates
    document.getElementById('cropType').addEventListener('change', updateSoilRecommendations);
    document.getElementById('irrigationType').addEventListener('change', updateEfficiencyNote);
}

function updateSoilRecommendations() {
    const cropType = document.getElementById('cropType').value;
    const soilSelect = document.getElementById('soilType');
    
    // Reset options
    soilSelect.querySelectorAll('option').forEach(option => {
        option.textContent = option.textContent.replace(' (Recommended)', '');
    });

    if (cropData[cropType]) {
        // Find best soil type
        const soilPreferences = cropData[cropType].soilPreference;
        const bestSoil = Object.entries(soilPreferences)
            .reduce((a, b) => a[1] > b[1] ? a : b)[0];

        // Mark recommended soil
        Array.from(soilSelect.options).forEach(option => {
            if (option.value === bestSoil) {
                option.textContent += ' (Recommended)';
            }
        });
    }
}

function calculateWaterUsage() {
    const formData = getFormData();
    if (!validateFormData(formData)) return;

    const results = calculateResults(formData);
    displayResults(results);
    generateRecommendations(formData, results);
}

function getFormData() {
    return {
        cropType: document.getElementById('cropType').value,
        landArea: parseFloat(document.getElementById('landArea').value),
        areaUnit: document.getElementById('areaUnit').value,
        soilType: document.getElementById('soilType').value,
        season: document.getElementById('season').value,
        irrigationType: document.getElementById('irrigationType').value,
        pumpPower: parseFloat(document.getElementById('pumpPower').value)
    };
}

function validateFormData(data) {
    // Add validation logic here
    return true;
}

function calculateResults(formData) {
    const crop = cropData[formData.cropType];
    let area = convertAreaToSquareMeters(formData.landArea, formData.areaUnit);
    
    // Calculate base water requirement
    let waterPerDay = (crop.waterNeeds * area) / 1000; // Convert mm to m³
    
    // Apply adjustments
    waterPerDay *= crop.soilPreference[formData.soilType];
    waterPerDay *= crop.seasonalAdjustment[formData.season];
    waterPerDay /= irrigationEfficiency[formData.irrigationType];
    
    // Convert to liters
    waterPerDay *= 1000;
    
    // Calculate power consumption
    const powerConsumption = waterPerDay * pumpPowerConsumption;
    const dailyCost = powerConsumption * electricityRate;

    return {
        waterPerDay: Math.round(waterPerDay),
        powerConsumption: powerConsumption.toFixed(2),
        dailyCost: dailyCost.toFixed(2)
    };
}

function displayResults(results) {
    document.getElementById('resultsSection').style.display = 'block';
    document.getElementById('dailyWater').textContent = `${results.waterPerDay.toLocaleString()} L/day`;
    document.getElementById('powerConsumption').textContent = `${results.powerConsumption} kWh/day`;
    document.getElementById('operatingCost').textContent = `$${results.dailyCost}/day`;
}

function generateRecommendations(formData, results) {
    const recommendationList = document.getElementById('recommendationList');
    recommendationList.innerHTML = '';

    const recommendations = [];

    // Add crop-specific recommendations
    if (cropData[formData.cropType]) {
        const crop = cropData[formData.cropType];
        
        // Soil recommendation
        const bestSoil = Object.entries(crop.soilPreference)
            .reduce((a, b) => a[1] > b[1] ? a : b)[0];
        if (formData.soilType !== bestSoil) {
            recommendations.push({
                icon: 'fa-soil',
                text: `Consider using ${bestSoil} soil for optimal water efficiency`
            });
        }

        // Irrigation method recommendation
        if (formData.irrigationType === 'flood' && results.waterPerDay > 5000) {
            recommendations.push({
                icon: 'fa-faucet',
                text: 'Consider switching to drip irrigation to reduce water consumption by up to 40%'
            });
        }

        // Seasonal recommendations
        if (formData.season === 'summer') {
            recommendations.push({
                icon: 'fa-sun',
                text: 'Consider early morning or evening irrigation to reduce evaporation loss'
            });
        }
    }

    // Add recommendations to the list
    recommendations.forEach(rec => {
        const li = document.createElement('li');
        li.innerHTML = `<i class="fas ${rec.icon}"></i><span>${rec.text}</span>`;
        recommendationList.appendChild(li);
    });
}

function addToSchedule() {
    const formData = getFormData();
    const results = calculateResults(formData);
    
    // Create schedule entry
    const scheduleEntry = {
        id: Date.now(),
        crop: formData.cropType,
        area: `${formData.landArea} ${formData.areaUnit}`,
        waterPerDay: results.waterPerDay,
        timeOfDay: ['06:00', '17:00'], // Default times
        duration: Math.ceil(results.waterPerDay / (formData.pumpPower * 60)) // minutes
    };

    // Save to local storage
    saveScheduleEntry(scheduleEntry);
    
    // Redirect to dashboard with success message
    window.location.href = 'dashboard.html?schedule=updated';
}

function saveScheduleEntry(entry) {
    let schedules = JSON.parse(localStorage.getItem('irrigationSchedules') || '[]');
    schedules.push(entry);
    localStorage.setItem('irrigationSchedules', JSON.stringify(schedules));
}

function loadExistingSchedules() {
    const schedules = JSON.parse(localStorage.getItem('irrigationSchedules') || '[]');
    // Add logic to display existing schedules if needed
}

function resetForm() {
    document.querySelector('.analysis-form').reset();
    document.getElementById('resultsSection').style.display = 'none';
}

function modifyCalculation() {
    document.getElementById('resultsSection').style.display = 'none';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Utility functions
function convertAreaToSquareMeters(value, unit) {
    switch (unit) {
        case 'hectare':
            return value * 10000;
        case 'acre':
            return value * 4046.86;
        case 'sqm':
            return value;
        default:
            return value;
    }
}