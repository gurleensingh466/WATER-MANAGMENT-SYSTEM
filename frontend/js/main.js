// API endpoints
const API_BASE_URL = 'http://localhost:8000/api';
const ENDPOINTS = {
    login: `${API_BASE_URL}/auth/token`,
    sensors: `${API_BASE_URL}/sensors`,
    weather: `${API_BASE_URL}/weather`,
    hazards: `${API_BASE_URL}/hazards`,
    alerts: `${API_BASE_URL}/alerts`
};

// Authentication
let authToken = localStorage.getItem('authToken');

async function login(email, password) {
    try {
        const response = await fetch(ENDPOINTS.login, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `username=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
        });

        if (response.ok) {
            const data = await response.json();
            authToken = data.access_token;
            localStorage.setItem('authToken', authToken);
            return true;
        } else {
            throw new Error('Login failed');
        }
    } catch (error) {
        console.error('Login error:', error);
        return false;
    }
}

// Modal Handling
const modal = document.getElementById('loginModal');
const loginBtn = document.getElementById('loginBtn');
const closeBtn = document.getElementsByClassName('close')[0];

loginBtn.onclick = () => modal.style.display = 'block';
closeBtn.onclick = () => modal.style.display = 'none';
window.onclick = (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};

// Login Form Handling
const loginForm = document.getElementById('loginForm');
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const success = await login(email, password);
    if (success) {
        modal.style.display = 'none';
        loginBtn.textContent = 'Profile';
        // Update UI for logged-in state
    } else {
        alert('Login failed. Please check your credentials.');
    }
});

// Preview Chart Setup
function setupPreviewChart() {
    const ctx = document.getElementById('previewChart').getContext('2d');
    const previewChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['12:00', '12:05', '12:10', '12:15', '12:20'],
            datasets: [{
                label: 'Water Quality Index',
                data: [95, 92, 88, 90, 93],
                borderColor: '#3498db',
                tension: 0.4,
                fill: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });
}

// Initialize Preview Chart
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('previewChart')) {
        setupPreviewChart();
    }
});