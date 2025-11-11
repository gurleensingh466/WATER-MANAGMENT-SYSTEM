# Quick Testing Guide - Water Usage & Pump Stats

## 🚀 Quick Start (5 Minutes)

### Step 1: Start Backend Server
```bash
cd "c:\Users\singh\OneDrive\Desktop\water project\backend"
python main.py
```
✅ You should see: `Uvicorn running on http://0.0.0.0:8000`

### Step 2: Open Pages in Browser
```
Water Usage: c:\Users\singh\OneDrive\Desktop\water project\frontend\water-usage.html
Pump Stats:  c:\Users\singh\OneDrive\Desktop\water project\frontend\pump-stats.html
```

### Step 3: Test API (Optional)
Visit: `http://localhost:8000/docs`

---

## ✅ Water Usage - Features to Test

### 1. Dashboard Stats (Top Cards)
- [x] Check if 4 stat cards display correctly
- [x] Verify progress bar animates
- [x] Check trend indicators show arrows

### 2. Water Source Levels
- [x] Verify 4 source cards (Tank, Borewell, Rainwater, Canal)
- [x] Check level meters show percentages
- [x] Verify status badges (Good, Warning, Excellent)

### 3. Charts
- [x] **Usage Trend Chart**: Line chart shows data
- [x] **Distribution Chart**: Pie chart displays crop distribution
- [x] Click period buttons (7D, 30D, 90D) - chart updates

### 4. Filters & Search
- [x] Type in search box - table filters
- [x] Select field filter - results update
- [x] Select crop filter - results update
- [x] Select status filter - results update
- [x] Pick date - results update
- [x] Click "Reset" button - clears all filters

### 5. Data Table
- [x] Verify 10 sample records display
- [x] Check status badges (Optimal, Overused, Underused)
- [x] Hover over rows - background changes
- [x] Check pagination buttons work

### 6. Add New Record
1. Click "+ Add Record" button
2. Fill form:
   - Field Name: Test Field
   - Crop Type: Wheat
   - Date: Today
   - Water Used: 5000
   - Start Time: 06:00
   - End Time: 08:00
   - Flow Rate: 45
   - Source: Tank
3. Click "Save Record"
4. ✅ Toast notification appears
5. ✅ New record appears in table

### 7. Edit Record
1. Click edit icon (✏️) on any row
2. Modal opens with pre-filled data
3. Change water used to 6000
4. Click "Save Record"
5. ✅ Table updates with new value

### 8. Delete Record
1. Click delete icon (🗑️) on any row
2. Confirmation modal appears
3. Click "Delete"
4. ✅ Record removed from table

### 9. Export
- [x] Click "CSV" button - download starts
- [x] Click "PDF" button - shows message

### 10. Refresh
- [x] Click refresh icon (🔄) - data reloads

---

## ⚙️ Pump Stats - Features to Test

### 1. System Overview Stats (Top Cards)
- [x] Check "Active Pumps" shows count (e.g., 3/6)
- [x] Check "Power Consumption" shows kW
- [x] Check "Total Flow Rate" shows L/min
- [x] Check "Avg Runtime" shows hours

### 2. Live Pump Status Grid
- [x] Verify 6 pump cards display
- [x] Check status badges:
  - 🟢 Green = Running (with pulse)
  - ⚫ Gray = Idle
  - 🟡 Orange = Maintenance
  - 🔴 Red = Error (with blink)
- [x] Verify metrics show: Flow Rate, Power, Runtime, Temp

### 3. Charts
- [x] **Power Trend Chart**: Line chart shows hourly data
- [x] **Runtime Distribution**: Doughnut chart shows per pump
- [x] Click period buttons (24H, 7D, 30D) - chart updates

### 4. Filter Tabs
- [x] Click "All" - shows all pumps
- [x] Click "Running" - shows only running pumps
- [x] Click "Idle" - shows only idle pumps
- [x] Click "Maintenance" - shows only maintenance pumps

### 5. Detailed Pump Table
- [x] Verify all 6 pumps in table
- [x] Check status indicators (colored dots)
- [x] Check efficiency progress bars
- [x] Verify maintenance dates display
- [x] Check temperature warnings (>60°C shows icon)

### 6. Add New Pump
1. Click "+ Add Pump" button
2. Fill form:
   - Pump Name: Pump-TEST
   - Location: Test Field
   - Power Rating: 5
   - Max Flow Rate: 150
   - Installation Date: Today
   - Manufacturer: Test Brand
   - Model Number: TEST-123
3. Click "Save Pump"
4. ✅ Toast notification appears
5. ✅ New pump appears in grid and table

### 7. Control Pump
1. Click "Control" button on any pump
2. Control modal opens showing pump details
3. Try these actions:
   - Click "Start Pump" (if idle)
     - ✅ Status changes to Running
     - ✅ Flow rate, voltage, current update
     - ✅ Temperature increases
   - Click "Stop Pump" (if running)
     - ✅ Status changes to Idle
     - ✅ Readings go to zero
   - Click "Mark for Maintenance"
     - ✅ Status changes to Maintenance
     - ✅ Maintenance dates update

### 8. Edit Pump
1. Click edit icon (✏️) on any pump card/row
2. Modal opens with pre-filled data
3. Change location to "New Location"
4. Click "Save Pump"
5. ✅ Table and grid update

### 9. Delete Pump
1. Click delete icon (🗑️)
2. Confirmation modal appears
3. Click "Delete"
4. ✅ Pump removed from grid and table

### 10. Alerts Section
- [x] Check alerts display at bottom
- [x] Verify different alert types:
  - ❌ Error alerts (red)
  - ⚠️ Warning alerts (orange)
  - ℹ️ Info alerts (blue)
- [x] Check alert messages make sense

### 11. Export Report
- [x] Click "Export Report" button
- [x] JSON file downloads with all pump data

### 12. Real-Time Updates (Wait 10 seconds)
- [x] Running pump temperatures fluctuate slightly
- [x] Flow rates adjust slightly
- [x] Stats cards update
- [x] Grid and table refresh

---

## 🧪 API Testing (via http://localhost:8000/docs)

### Water Usage APIs

#### Test 1: Get All Records
```
GET /api/water-usage
Response: 200 OK, Array of records
```

#### Test 2: Create Record
```
POST /api/water-usage/add
Body:
{
  "field_name": "API Test Field",
  "crop_type": "Rice",
  "date": "2024-01-15",
  "water_used": 7500,
  "start_time": "06:00",
  "end_time": "09:00",
  "flow_rate": 50,
  "source": "Borewell"
}
Response: 201 Created
```

#### Test 3: Get Dashboard Stats
```
GET /api/water-usage/stats/dashboard
Response: 200 OK, Statistics object
```

### Pump Stats APIs

#### Test 4: Get All Pumps
```
GET /api/pumps/status
Response: 200 OK, Array of pumps
```

#### Test 5: Control Pump
```
POST /api/pumps/control
Body:
{
  "pump_id": 3,
  "action": "start"
}
Response: 200 OK, Success message
```

#### Test 6: Get System Stats
```
GET /api/pumps/stats/system
Response: 200 OK, System statistics
```

#### Test 7: Get Alerts
```
GET /api/pumps/alerts
Response: 200 OK, Array of alerts
```

---

## 🎯 Expected Behavior

### Water Usage Page Should Show:
✅ 4 stat cards with animated progress bars
✅ 4 water source level meters
✅ 2 interactive charts (trend line + distribution pie)
✅ Search bar and 4 filter dropdowns
✅ Data table with 10 sample records
✅ Edit/Delete icons that open modals
✅ Toast notifications on actions

### Pump Stats Page Should Show:
✅ 4 system stat cards
✅ 6 pump cards in grid (3 running, 2 idle, 1 maintenance, 1 error)
✅ Live status indicators (pulse/blink animations)
✅ 2 charts (power trend line + runtime doughnut)
✅ Filter tabs (All, Running, Idle, Maintenance)
✅ Detailed table with 6 pumps
✅ 3-5 alert notifications
✅ Control modal with start/stop/maintenance buttons

---

## 🔍 Common Issues & Solutions

### Issue: Charts not showing
**Solution**: 
- Open browser console (F12)
- Check if Chart.js loaded
- Verify canvas elements exist

### Issue: API calls fail
**Solution**:
- Check backend is running on port 8000
- Visit http://localhost:8000/docs to verify
- Check CORS settings in main.py

### Issue: Modals don't open
**Solution**:
- Open browser console
- Check for JavaScript errors
- Verify modal IDs match in HTML and JS

### Issue: Real-time updates not working
**Solution**:
- Check if setInterval is running (console logs)
- Verify data updates every 10-30 seconds
- Reload page

### Issue: Buttons don't work
**Solution**:
- Check browser console for errors
- Verify JavaScript files are loaded
- Check event listeners are attached

---

## ✨ Pro Tips

1. **Use Browser Console**: Press F12 to see logs and errors
2. **Check Network Tab**: See API calls and responses
3. **Test in Incognito**: Avoid cache issues
4. **Use Different Browsers**: Chrome, Firefox, Edge
5. **Mobile Testing**: Use responsive design mode (F12 → Toggle device toolbar)

---

## 📊 Sample Test Data

### Water Usage Record
```javascript
{
  field_name: "Test Field A-99",
  crop_type: "Wheat",
  date: "2024-01-15",
  water_used: 5500,
  start_time: "06:00",
  end_time: "08:30",
  flow_rate: 46,
  source: "Tank",
  notes: "Test irrigation record"
}
```

### Pump Record
```javascript
{
  name: "Pump-TEST-01",
  location: "Test Field - North",
  power_rating: 5.5,
  max_flow_rate: 175,
  manufacturer: "Test Manufacturer",
  model_number: "TEST-550",
  installation_date: "2024-01-01",
  maintenance_interval: 90,
  notes: "Test pump for development"
}
```

---

## 🎬 Quick Demo Script (2 Minutes)

1. **Open Water Usage page**
   - ✅ See dashboard with stats
   - ✅ Click "Add Record" → Fill form → Save
   - ✅ Click edit on first row → Change value → Save
   - ✅ Click delete on last row → Confirm

2. **Open Pump Stats page**
   - ✅ See 6 pump cards with live indicators
   - ✅ Click "Control" on idle pump → Start it
   - ✅ Watch status change to Running with green pulse
   - ✅ Click "Stop" → Status changes to Idle

3. **Test Filters**
   - ✅ Click "Running" tab → See only running pumps
   - ✅ Click "All" tab → See all pumps

4. **Check Alerts**
   - ✅ Scroll down → See alert notifications
   - ✅ High temperature warnings
   - ✅ Maintenance due alerts

**Done! 🎉**

---

## 📝 Test Checklist

Copy this and check off as you test:

### Water Usage
- [ ] All stats cards display correctly
- [ ] Water source levels animate
- [ ] Both charts load and display data
- [ ] Search and filters work
- [ ] Add record works
- [ ] Edit record works
- [ ] Delete record works
- [ ] Export CSV works
- [ ] Pagination works
- [ ] Responsive on mobile

### Pump Stats
- [ ] All stats cards display correctly
- [ ] 6 pump cards show with correct status
- [ ] Live indicators animate (pulse/blink)
- [ ] Both charts load and display data
- [ ] Filter tabs work
- [ ] Add pump works
- [ ] Control pump (start/stop) works
- [ ] Edit pump works
- [ ] Delete pump works
- [ ] Alerts display correctly
- [ ] Export report works
- [ ] Real-time updates work (wait 10 sec)
- [ ] Responsive on mobile

---

**Testing Time**: ~10-15 minutes
**Last Updated**: January 15, 2024
