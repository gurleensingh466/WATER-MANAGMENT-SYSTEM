# Testing Checklist - Water Management System

## ✅ Pre-Testing Setup

- [ ] Backend server is running (`python main.py`)
- [ ] Frontend is accessible (open HTML files or use local server)
- [ ] Browser console is open (F12) to check for errors
- [ ] Network tab is open to monitor API calls

## 🧪 Irrigation Schedule Page Tests

### Page Loading
- [ ] Page loads without errors
- [ ] All 4 statistics cards are visible
- [ ] Table displays with sample data (12 entries)
- [ ] Pagination shows correct page numbers
- [ ] Filters are visible and functional

### Table Display
- [ ] All 12 columns are visible:
  - [ ] Crop Name
  - [ ] Field Location
  - [ ] Moisture Level (with progress bar)
  - [ ] Start Time
  - [ ] End Time
  - [ ] Water Used
  - [ ] Date
  - [ ] Weather (with emoji)
  - [ ] Next Schedule
  - [ ] Worker Name
  - [ ] Status (with colored badge)
  - [ ] Actions (Edit/Delete buttons)

### Moisture Visualization
- [ ] Progress bars display correctly
- [ ] Percentages show next to bars
- [ ] Colors change based on moisture level
- [ ] Animation plays on page load

### Status Badges
- [ ] "Completed" shows green badge
- [ ] "Pending" shows yellow badge
- [ ] "In Progress" shows blue badge
- [ ] Badges are capitalized correctly

### Weather Icons
- [ ] ☀️ Sunny displays correctly
- [ ] ☁️ Cloudy displays correctly
- [ ] 🌧️ Rainy displays correctly
- [ ] ⛅ Partly Cloudy displays correctly

### Add Schedule Feature
- [ ] "Add Schedule" button is visible
- [ ] Button is positioned top-right
- [ ] Clicking opens modal
- [ ] Modal animates smoothly
- [ ] Form has all fields:
  - [ ] Crop Name (dropdown)
  - [ ] Field Location (text)
  - [ ] Moisture Level (number)
  - [ ] Water Used (number)
  - [ ] Start Time (time picker)
  - [ ] End Time (time picker)
  - [ ] Date (date picker)
  - [ ] Weather (dropdown with emojis)
  - [ ] Next Schedule (date picker)
  - [ ] Worker Name (text)
  - [ ] Status (dropdown)
  - [ ] Notes (textarea)
- [ ] Required fields show asterisk (*)
- [ ] Cancel button closes modal
- [ ] X button closes modal
- [ ] Clicking outside modal closes it

### Add Schedule Functionality
- [ ] Fill all required fields
- [ ] Click "Save Schedule"
- [ ] Modal closes
- [ ] Success notification appears
- [ ] New entry appears at top of table
- [ ] Pagination updates if needed
- [ ] Data persists on page refresh

### Edit Schedule Feature
- [ ] Edit icon (✏️) visible on each row
- [ ] Clicking edit opens modal
- [ ] Modal title shows "Edit Schedule"
- [ ] Form pre-fills with existing data
- [ ] All fields are editable
- [ ] Save updates the row
- [ ] Success notification appears
- [ ] Table updates without refresh

### Delete Schedule Feature
- [ ] Delete icon (🗑️) visible on each row
- [ ] Clicking delete opens confirmation modal
- [ ] Warning icon (⚠️) displays
- [ ] Warning message displays
- [ ] "This action cannot be undone" shows
- [ ] Cancel button closes modal
- [ ] Delete button removes entry
- [ ] Success notification appears
- [ ] Table updates immediately
- [ ] Pagination adjusts if needed

### Filtering
- [ ] Status filter works:
  - [ ] "All" shows all entries
  - [ ] "Completed" shows only completed
  - [ ] "Pending" shows only pending
  - [ ] "In Progress" shows only in-progress
- [ ] Crop filter works:
  - [ ] "All" shows all crops
  - [ ] Specific crop shows only that crop
- [ ] Date range filter works:
  - [ ] Start date filters correctly
  - [ ] End date filters correctly
  - [ ] Both dates work together
- [ ] Multiple filters work together
- [ ] Reset button clears all filters
- [ ] Filtered results show in table
- [ ] Pagination resets to page 1

### Pagination
- [ ] Shows "10 items per page" by default
- [ ] Previous button disabled on page 1
- [ ] Next button disabled on last page
- [ ] Page numbers clickable
- [ ] Active page highlighted
- [ ] Ellipsis (...) for many pages
- [ ] Clicking page number navigates correctly
- [ ] Table updates when page changes

### Responsive Design
- [ ] Desktop view (>1200px) looks good
- [ ] Tablet view (768-1199px) has horizontal scroll
- [ ] Mobile view (<768px) stacks properly
- [ ] Cards stack on mobile
- [ ] Filters stack on mobile
- [ ] Table scrolls horizontally on mobile

## 🎨 Dashboard Page Tests

### Page Loading
- [ ] Page loads without errors
- [ ] All 6 dashboard cards visible
- [ ] Cards arranged in grid
- [ ] Map section loads
- [ ] Charts render correctly

### Dashboard Cards Display
1. **Total Water Used Today**
   - [ ] Card displays correctly
   - [ ] Icon shows (💧)
   - [ ] Value shows "12,450 L"
   - [ ] Progress bar visible
   - [ ] Progress bar shows 68%
   - [ ] Gradient is blue
   - [ ] Trend text shows "12% from yesterday"
   - [ ] Trend arrow is up (positive)

2. **Active Fields**
   - [ ] Card displays correctly
   - [ ] Icon shows (🌱)
   - [ ] Value shows "12/15"
   - [ ] Progress bar shows 80%
   - [ ] Gradient is green
   - [ ] Trend shows "3 fields harvested"

3. **Moisture Average**
   - [ ] Card displays correctly
   - [ ] Icon shows (💦)
   - [ ] Value shows "58%"
   - [ ] Progress bar shows 58%
   - [ ] Gradient is orange
   - [ ] Shows "Within normal range"

4. **Pending Irrigations**
   - [ ] Card displays correctly
   - [ ] Icon shows (⏰)
   - [ ] Value shows "5"
   - [ ] Progress bar shows 38%
   - [ ] Gradient is purple
   - [ ] Shows "2 urgent" warning

5. **Weather Update**
   - [ ] Card displays correctly
   - [ ] Icon shows (🌤️)
   - [ ] Value shows "Partly Cloudy"
   - [ ] Weather grid visible
   - [ ] Temperature shows (25°C)
   - [ ] Humidity shows (65%)
   - [ ] Wind shows (12 km/h)
   - [ ] Visibility shows (10 km)
   - [ ] Gradient is yellow

6. **Power Consumption**
   - [ ] Card displays correctly
   - [ ] Icon shows (⚡)
   - [ ] Value shows "23.5 kWh"
   - [ ] Progress bar shows 47%
   - [ ] Gradient is red
   - [ ] Trend is negative (down arrow)

### Card Interactions
- [ ] Hover over card:
  - [ ] Card lifts slightly
  - [ ] Shadow increases
  - [ ] Edit/Delete buttons appear
  - [ ] Transition is smooth
- [ ] Edit button:
  - [ ] Icon is ✏️
  - [ ] Hover turns blue
  - [ ] Click shows prompt
  - [ ] Can enter new value
  - [ ] Clicking OK updates card
  - [ ] Success notification appears
  - [ ] Update is immediate (no reload)
- [ ] Delete button:
  - [ ] Icon is 🗑️
  - [ ] Hover turns red
  - [ ] Click shows confirmation
  - [ ] Confirmation has warning
  - [ ] Clicking OK removes card
  - [ ] Fade-out animation plays
  - [ ] Success notification appears

### Progress Bar Animations
- [ ] Progress bars animate on load
- [ ] Shimmer effect visible
- [ ] Animation is smooth (60fps)
- [ ] Different widths for different values
- [ ] Gradient colors match card theme

### Card Persistence
- [ ] Edit a card value
- [ ] Refresh the page
- [ ] Edited value persists
- [ ] Delete a card
- [ ] Refresh the page
- [ ] Card stays deleted

### Notifications
- [ ] Success notifications are green
- [ ] Error notifications are red
- [ ] Slide in from right
- [ ] Display for 3 seconds
- [ ] Slide out to right
- [ ] Auto-dismiss works
- [ ] Icon shows (✓ for success, ✕ for error)

## 🔧 Backend API Tests

### Irrigation Schedule Endpoints

#### GET /api/irrigation-schedules
- [ ] Returns list of schedules
- [ ] Status filter works
- [ ] Crop filter works
- [ ] Date filters work
- [ ] Returns 200 status code

#### GET /api/irrigation-schedules/{id}
- [ ] Returns specific schedule
- [ ] Returns 200 for valid ID
- [ ] Returns 404 for invalid ID

#### POST /api/irrigation-schedules
- [ ] Creates new schedule
- [ ] Returns created schedule
- [ ] Returns 200 status code
- [ ] Validates required fields
- [ ] Returns error for missing fields

#### PUT /api/irrigation-schedules/{id}
- [ ] Updates existing schedule
- [ ] Returns updated schedule
- [ ] Returns 200 for valid ID
- [ ] Returns 404 for invalid ID

#### DELETE /api/irrigation-schedules/{id}
- [ ] Deletes schedule
- [ ] Returns success message
- [ ] Returns 200 for valid ID
- [ ] Returns 404 for invalid ID

#### GET /api/irrigation-schedules/stats/today
- [ ] Returns today's statistics
- [ ] Shows completed count
- [ ] Shows pending count
- [ ] Shows total water used
- [ ] Returns 200 status code

#### GET /api/irrigation-schedules/stats/summary
- [ ] Returns overall statistics
- [ ] Shows total schedules
- [ ] Shows unique fields
- [ ] Shows unique crops
- [ ] Returns 200 status code

### Dashboard Endpoints

#### GET /api/dashboard/cards
- [ ] Returns all cards
- [ ] Returns 200 status code
- [ ] Returns list of 6 cards

#### GET /api/dashboard/cards/{id}
- [ ] Returns specific card
- [ ] Returns 200 for valid ID
- [ ] Returns 404 for invalid ID

#### PUT /api/dashboard/cards/{id}
- [ ] Updates card
- [ ] Returns updated card
- [ ] Updates only provided fields
- [ ] Returns 200 status code

#### DELETE /api/dashboard/cards/{id}
- [ ] Deletes card
- [ ] Returns success message
- [ ] Returns 200 status code

#### GET /api/dashboard/stats
- [ ] Returns dashboard statistics
- [ ] Returns all metrics
- [ ] Returns 200 status code

## 🌐 Browser Compatibility

### Chrome
- [ ] Page loads correctly
- [ ] Animations work smoothly
- [ ] All features functional
- [ ] No console errors

### Firefox
- [ ] Page loads correctly
- [ ] Animations work smoothly
- [ ] All features functional
- [ ] No console errors

### Safari
- [ ] Page loads correctly
- [ ] Animations work smoothly
- [ ] All features functional
- [ ] No console errors

### Edge
- [ ] Page loads correctly
- [ ] Animations work smoothly
- [ ] All features functional
- [ ] No console errors

## 📱 Device Testing

### Desktop (1920x1080)
- [ ] Layout is optimal
- [ ] No horizontal scroll
- [ ] All elements visible
- [ ] Cards in 3-column grid

### Laptop (1366x768)
- [ ] Layout adapts well
- [ ] Cards in 2-3 column grid
- [ ] No content cutoff

### Tablet Portrait (768x1024)
- [ ] Cards stack to 2 columns
- [ ] Table has horizontal scroll
- [ ] Filters stack vertically
- [ ] Touch targets adequate

### Tablet Landscape (1024x768)
- [ ] Cards in 2-3 columns
- [ ] Table visible without scroll
- [ ] Layout balanced

### Mobile (375x667)
- [ ] Cards stack to 1 column
- [ ] Table scrolls horizontally
- [ ] Filters stack vertically
- [ ] Buttons are touch-friendly
- [ ] Modal fits screen
- [ ] Text is readable

## 🎯 Performance Tests

- [ ] Page load time < 3 seconds
- [ ] No layout shifts (CLS)
- [ ] Animations are smooth (60fps)
- [ ] No memory leaks (check DevTools)
- [ ] Images load quickly
- [ ] API calls respond < 1 second

## ♿ Accessibility Tests

- [ ] Tab navigation works
- [ ] Focus indicators visible
- [ ] Buttons have aria-labels
- [ ] Form inputs have labels
- [ ] Color contrast is sufficient
- [ ] Screen reader compatible
- [ ] Keyboard shortcuts work

## 🔒 Security Tests

- [ ] XSS prevention works
- [ ] Input validation present
- [ ] No sensitive data in URLs
- [ ] CORS configured correctly
- [ ] API errors handled gracefully

## 📝 Test Results Summary

### Passed Tests: ___ / ___
### Failed Tests: ___ / ___
### Blocked Tests: ___ / ___

## 🐛 Issues Found

1. **Issue**: 
   - **Severity**: High/Medium/Low
   - **Steps to Reproduce**: 
   - **Expected Result**: 
   - **Actual Result**: 
   - **Status**: 

2. **Issue**: 
   - **Severity**: 
   - **Steps to Reproduce**: 
   - **Expected Result**: 
   - **Actual Result**: 
   - **Status**: 

## ✅ Sign-Off

- **Tested By**: ________________
- **Date**: ________________
- **Browser/OS**: ________________
- **Status**: ☐ Pass  ☐ Pass with Issues  ☐ Fail
- **Notes**: 

---

## 🎉 Quick Test Script

For a rapid smoke test, follow these steps:

1. **Open irrigation-schedule.html**
   - Add a schedule → Verify it appears
   - Edit a schedule → Verify it updates
   - Delete a schedule → Verify it's removed
   - Apply a filter → Verify results
   - Navigate pages → Verify pagination

2. **Open dashboard.html**
   - Hover each card → Verify actions appear
   - Edit a card → Verify it updates
   - Delete a card → Verify it's removed
   - Refresh page → Verify persistence

3. **Check Backend**
   - Visit http://localhost:8000/docs
   - Test a GET endpoint
   - Test a POST endpoint
   - Verify responses

**If all 3 steps pass, basic functionality is working! ✅**
