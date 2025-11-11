# Water Usage & Pump Stats Enhancement Documentation

## 📋 Overview

This document provides comprehensive details about the newly enhanced **Water Usage** and **Pump Stats** sections of the Smart Farming / Water Monitoring Web Application.

---

## 🎯 Enhancement Summary

Both sections have been completely redesigned and upgraded to provide:
- ✅ Professional, dashboard-style layouts
- ✅ Real-time data monitoring and updates
- ✅ Full CRUD operations (Create, Read, Update, Delete)
- ✅ Interactive charts and visualizations
- ✅ Advanced filtering and search
- ✅ Export capabilities
- ✅ Responsive design for all devices
- ✅ Complete backend API integration

---

## 💧 Water Usage Section

### Files Created/Modified

#### Frontend
1. **water-usage.html** (Modified)
   - Location: `frontend/water-usage.html`
   - Complete redesign with dashboard layout
   - Features:
     - Header with refresh, export, and add buttons
     - 4 dashboard stat cards (Total Water, Avg Usage, Cost, Efficiency)
     - Water source level visualization (Tank, Borewell, Rainwater, Canal)
     - Interactive trend and distribution charts
     - Advanced filter bar (search, field, crop, status, date)
     - Enhanced data table with 9 columns
     - Add/Edit modal with comprehensive form
     - Delete confirmation modal

2. **water-usage-enhanced.css** (New)
   - Location: `frontend/css/water-usage-enhanced.css`
   - 900+ lines of comprehensive styling
   - Features:
     - Modern gradient cards with animations
     - Responsive grid layouts
     - Chart container styling
     - Modal dialog animations
     - Table hover effects
     - Progress bars and meters
     - Mobile-responsive design

3. **water-usage-enhanced.js** (New)
   - Location: `frontend/js/water-usage-enhanced.js`
   - 800+ lines of functionality
   - Features:
     - Complete CRUD operations
     - Chart.js integration (trend line chart, pie chart)
     - Real-time updates (30-second intervals)
     - Filter and search functionality
     - Pagination for large datasets
     - CSV/PDF export capabilities
     - Form validation
     - Toast notifications

#### Backend
4. **water_usage.py** (New)
   - Location: `backend/api/routes/water_usage.py`
   - Complete RESTful API with 11 endpoints
   - Features:
     - GET `/api/water-usage` - List with filters
     - GET `/api/water-usage/{id}` - Get by ID
     - POST `/api/water-usage/add` - Create record
     - PUT `/api/water-usage/update/{id}` - Update record
     - DELETE `/api/water-usage/delete/{id}` - Delete record
     - GET `/api/water-usage/stats/dashboard` - Dashboard statistics
     - GET `/api/water-usage/stats/sources` - Water source levels
     - GET `/api/water-usage/stats/trend` - Usage trend data
     - GET `/api/water-usage/stats/distribution` - Distribution by crop
     - POST `/api/water-usage/bulk-delete` - Bulk operations
     - GET `/api/water-usage/export/csv` - CSV export

### Key Features

#### Dashboard Stats Cards
```
┌─────────────────────┐  ┌─────────────────────┐
│ Total Water Today   │  │ Avg Usage per m²    │
│ 24,750 L            │  │ 28.4 L/m²           │
│ ▓▓▓▓▓▓▓░░░ 82%      │  │ ↓ 5% vs yesterday   │
└─────────────────────┘  └─────────────────────┘

┌─────────────────────┐  ┌─────────────────────┐
│ Total Cost          │  │ Water Efficiency    │
│ ₹1,485              │  │ 87%                 │
│ ↑ 8% vs yesterday   │  │ ↑ 3% vs yesterday   │
└─────────────────────┘  └─────────────────────┘
```

#### Water Source Levels
- Real-time level visualization with circular meters
- Color-coded status indicators
- Current volume and capacity display
- Status badges (Good, Warning, Excellent)

#### Interactive Charts
1. **Usage Trend Chart** (Line Chart)
   - Shows water usage over last 7/30/90 days
   - Smooth animations
   - Hover tooltips with exact values

2. **Distribution Chart** (Doughnut Chart)
   - Shows water usage distribution by crop type
   - Percentage breakdown
   - Color-coded segments

#### Data Table Features
- 9 columns of detailed information
- Status badges (Optimal, Overused, Underused)
- Edit and Delete actions for each row
- Pagination for large datasets
- Responsive design

### API Endpoints

#### Get All Water Usage Records
```http
GET /api/water-usage
Query Parameters:
  - field_name: string (optional)
  - crop_type: string (optional)
  - status: string (optional) - optimal, overused, underused
  - date_from: date (optional)
  - date_to: date (optional)
  - limit: integer (default: 100)
  - skip: integer (default: 0)
```

#### Create Water Usage Record
```http
POST /api/water-usage/add
Body:
{
  "field_name": "Field A-01",
  "crop_type": "Wheat",
  "date": "2024-01-15",
  "water_used": 5200,
  "start_time": "06:00",
  "end_time": "08:30",
  "flow_rate": 45.5,
  "source": "Tank",
  "notes": "Regular irrigation"
}
```

#### Update Water Usage Record
```http
PUT /api/water-usage/update/{id}
Body: (same as create, all fields optional)
```

#### Delete Water Usage Record
```http
DELETE /api/water-usage/delete/{id}
```

#### Get Dashboard Statistics
```http
GET /api/water-usage/stats/dashboard
Response:
{
  "total_water_today": 24750.0,
  "target_water": 30000.0,
  "avg_usage": 28.4,
  "total_cost": 1485.0,
  "efficiency": 87.0,
  "water_trend": 12.0,
  "usage_trend": 12.0,
  "cost_trend": 8.0,
  "efficiency_trend": 3.0
}
```

---

## ⚙️ Pump Stats Section

### Files Created

#### Frontend
1. **pump-stats.html** (New)
   - Location: `frontend/pump-stats.html`
   - Complete pump management interface
   - Features:
     - Header with action buttons
     - 4 system overview stat cards
     - Live pump status grid with real-time indicators
     - Performance charts (power trend, runtime distribution)
     - Detailed pump table with 10 columns
     - Filter tabs for quick status filtering
     - Alerts & notifications section
     - Add/Edit pump modal
     - Pump control modal (start/stop/maintenance)
     - Delete confirmation modal

2. **pump-stats.css** (New)
   - Location: `frontend/css/pump-stats.css`
   - 1000+ lines of comprehensive styling
   - Features:
     - Live status indicators with pulse animations
     - Color-coded pump cards by status
     - Chart styling
     - Control panel design
     - Alert system styling
     - Responsive grid layouts
     - Modal animations

3. **pump-stats.js** (New)
   - Location: `frontend/js/pump-stats.js`
   - 900+ lines of functionality
   - Features:
     - Complete CRUD operations
     - Real-time pump control (start/stop/maintenance)
     - Chart.js integration (power trend, runtime distribution)
     - Live status updates (10-second intervals)
     - Filter by pump status
     - Alert monitoring
     - Export report functionality
     - Toast notifications

#### Backend
4. **pump_stats.py** (New)
   - Location: `backend/api/routes/pump_stats.py`
   - Complete RESTful API with 15 endpoints
   - Features:
     - GET `/api/pumps/status` - List with filters
     - GET `/api/pumps/live` - Real-time data
     - GET `/api/pumps/{id}` - Get by ID
     - POST `/api/pumps/add` - Create pump
     - PUT `/api/pumps/update/{id}` - Update pump
     - DELETE `/api/pumps/delete/{id}` - Delete pump
     - POST `/api/pumps/control` - Control pump (start/stop/maintenance)
     - GET `/api/pumps/stats/system` - System statistics
     - GET `/api/pumps/stats/power-trend` - Power consumption trend
     - GET `/api/pumps/stats/runtime-distribution` - Runtime distribution
     - GET `/api/pumps/alerts` - Get current alerts
     - POST `/api/pumps/maintenance/complete/{id}` - Complete maintenance
     - POST `/api/pumps/bulk-delete` - Bulk delete
     - GET `/api/pumps/export/report` - Export report

### Key Features

#### System Overview Stats
```
┌─────────────────────┐  ┌─────────────────────┐
│ Active Pumps        │  │ Power Consumption   │
│ 3/6                 │  │ 19.4 kW             │
│ ✓ All operational   │  │ 128.7 kWh today     │
└─────────────────────┘  └─────────────────────┘

┌─────────────────────┐  ┌─────────────────────┐
│ Total Flow Rate     │  │ Avg Runtime Today   │
│ 525 L/min           │  │ 3.9 hrs             │
│ ↑ Combined output   │  │ ✓ Within limits     │
└─────────────────────┘  └─────────────────────┘
```

#### Live Pump Status Grid
Each pump card displays:
- Pump name and location
- Live status indicator (🟢 Running, ⚫ Idle, 🟡 Maintenance, 🔴 Error)
- Flow rate, power consumption, runtime, temperature
- Control, Edit, and Delete buttons
- Color-coded borders based on status
- Pulse animations for running pumps

#### Pump Status Indicators
- **Running**: Green with pulse animation
- **Idle**: Gray (inactive)
- **Maintenance**: Orange/yellow
- **Error**: Red with blink animation

#### Performance Charts
1. **Power Consumption Trend** (Line Chart)
   - Shows power usage over last 24 hours/7 days/30 days
   - Real-time updates
   - Smooth animations

2. **Runtime Distribution** (Doughnut Chart)
   - Shows runtime hours for each pump
   - Color-coded segments
   - Percentage breakdown

#### Detailed Pump Table
Columns:
1. Pump ID/Name
2. Location
3. Status (with live indicator)
4. Power Rating (HP)
5. Flow Rate (L/min)
6. Runtime Today (hours)
7. Temperature (°C) with warning icons
8. Efficiency (with progress bar)
9. Next Maintenance Date
10. Action buttons (Control, Edit, Delete)

#### Alerts & Notifications
Real-time alerts for:
- ❌ Pump errors/failures
- ⚠️ High temperature warnings
- ⚠️ Maintenance due soon
- ℹ️ Low efficiency alerts

### API Endpoints

#### Get All Pumps
```http
GET /api/pumps/status
Query Parameters:
  - status: string (optional) - running, idle, maintenance, error
  - location: string (optional)
  - limit: integer (default: 100)
  - skip: integer (default: 0)
```

#### Get Live Pump Data
```http
GET /api/pumps/live
Response: Array of all pumps with real-time data
```

#### Create Pump
```http
POST /api/pumps/add
Body:
{
  "name": "Pump-A01",
  "location": "North Field - Borewell",
  "power_rating": 5.0,
  "max_flow_rate": 180,
  "manufacturer": "CRI Pumps",
  "model_number": "CR-500X",
  "installation_date": "2023-01-15",
  "maintenance_interval": 90,
  "notes": "Primary borewell pump"
}
```

#### Update Pump
```http
PUT /api/pumps/update/{id}
Body: (same as create, all fields optional)
```

#### Delete Pump
```http
DELETE /api/pumps/delete/{id}
```

#### Control Pump
```http
POST /api/pumps/control
Body:
{
  "pump_id": 1,
  "action": "start" | "stop" | "maintenance"
}
```

#### Get System Statistics
```http
GET /api/pumps/stats/system
Response:
{
  "total_pumps": 6,
  "active_pumps": 3,
  "idle_pumps": 2,
  "maintenance_pumps": 1,
  "error_pumps": 0,
  "total_power_consumption": 19.4,
  "total_flow_rate": 525,
  "avg_runtime": 3.9,
  "total_energy_today": 128.7,
  "avg_efficiency": 88.3
}
```

#### Get Pump Alerts
```http
GET /api/pumps/alerts
Response: Array of current alerts
[
  {
    "type": "warning",
    "pump_id": 5,
    "pump_name": "Pump-E05",
    "title": "High Temperature Alert",
    "message": "Temperature is 52°C. Normal operation is below 55°C.",
    "timestamp": "2024-01-15T10:30:00"
  }
]
```

---

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- FastAPI
- Uvicorn
- Modern web browser

### Installation

1. **Install Backend Dependencies**
```bash
cd backend
pip install -r requirements.txt
```

2. **Start Backend Server**
```bash
python main.py
# Server runs on http://localhost:8000
```

3. **Open Frontend**
```bash
# Open in browser:
# frontend/water-usage.html
# frontend/pump-stats.html
```

### Testing API Endpoints

Visit the interactive API documentation:
```
http://localhost:8000/docs
```

---

## 📊 Data Models

### Water Usage Record
```javascript
{
  id: number,
  field_name: string,
  crop_type: string,
  date: date,
  water_used: number,  // Liters
  start_time: string,  // HH:MM
  end_time: string,    // HH:MM
  flow_rate: number,   // L/min
  source: string,      // Tank, Borewell, Rainwater, Canal
  status: string,      // optimal, overused, underused
  cost: number,        // INR
  duration: string,    // Calculated
  notes: string
}
```

### Pump Record
```javascript
{
  id: number,
  name: string,
  location: string,
  status: string,        // running, idle, maintenance, error
  power_rating: number,  // HP
  max_flow_rate: number, // L/min
  flow_rate: number,     // Current L/min
  voltage: number,       // V
  current: number,       // A
  power_consumption: number,  // kW
  runtime_today: number,      // hours
  temperature: number,        // °C
  efficiency: number,         // %
  last_maintenance: date,
  next_maintenance: date,
  manufacturer: string,
  model_number: string,
  installation_date: date,
  maintenance_interval: number,  // days
  energy_today: number,          // kWh
  total_runtime: number,         // hours
  notes: string
}
```

---

## 🎨 Design Features

### Color Scheme
- **Primary**: #2196F3 (Blue)
- **Success**: #4CAF50 (Green)
- **Warning**: #FF9800 (Orange)
- **Danger**: #F44336 (Red)
- **Info**: #00BCD4 (Cyan)
- **Purple**: #9C27B0

### Animations
- Card hover effects (translateY + shadow)
- Modal slide-up entrance
- Progress bar fill animations
- Status indicator pulse/blink
- Toast notification slide-in
- Smooth chart transitions

### Responsive Breakpoints
- Desktop: > 1200px
- Tablet: 768px - 1200px
- Mobile: < 768px

---

## 🔧 Customization

### Adding New Crop Types
Edit `water-usage-enhanced.js`:
```javascript
// In the form modal
<option value="NewCrop">New Crop</option>
```

### Adjusting Update Intervals
```javascript
// Water Usage - 30 seconds
setInterval(() => {
    loadDashboardStats();
    loadSourceLevels();
}, 30000);

// Pump Stats - 10 seconds
setInterval(() => {
    loadSystemStats();
    renderPumpsGrid();
}, 10000);
```

### Modifying Cost Calculation
Edit `water_usage.py`:
```python
def calculate_cost(water_used: float) -> float:
    cost_per_liter = 0.06  # Change this value
    return round(water_used * cost_per_liter, 2)
```

---

## 🐛 Troubleshooting

### API Connection Issues
1. Verify backend is running: `http://localhost:8000`
2. Check CORS configuration in `backend/main.py`
3. Inspect browser console for errors

### Charts Not Displaying
1. Verify Chart.js is loaded: Check browser console
2. Ensure canvas elements have correct IDs
3. Check chart initialization in JavaScript

### Modal Not Opening
1. Check for JavaScript errors in console
2. Verify modal ID matches in HTML and JS
3. Ensure event listeners are attached

---

## 📈 Future Enhancements

### Planned Features
- [ ] WebSocket for true real-time updates
- [ ] Advanced analytics dashboard
- [ ] Predictive maintenance alerts
- [ ] Mobile app integration
- [ ] PDF report generation
- [ ] Email/SMS notifications
- [ ] Multi-language support
- [ ] Dark mode theme
- [ ] Historical data comparison
- [ ] Weather integration for irrigation recommendations

---

## 📝 Change Log

### Version 2.0.0 (Current)
- ✅ Complete Water Usage page redesign
- ✅ New Pump Stats page from scratch
- ✅ Real-time monitoring capabilities
- ✅ Full CRUD operations
- ✅ Interactive charts and visualizations
- ✅ Comprehensive API implementation
- ✅ Mobile-responsive design
- ✅ Toast notifications
- ✅ Export functionality

---

## 👥 Support

For issues or questions:
1. Check this documentation
2. Review API docs at `/docs`
3. Inspect browser console for errors
4. Check backend logs

---

## 📄 License

This project is part of the Water Monitoring System.
All rights reserved.

---

**Last Updated**: January 15, 2024
**Version**: 2.0.0
**Author**: Smart Farming Development Team
