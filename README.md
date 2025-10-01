<<<<<<< HEAD
# WATER-MANAGMENT-SYSTEM
# WATER-MANAGMENT-SYSTEM
=======
# Water Monitoring System

A professional full-stack web application for real-time water quality monitoring with sensor data integration, hazard detection, and alert system.

## Features

- Real-time water quality monitoring
- Simple and Professional view modes
- SMS alerts for hazardous conditions
- Weather data integration
- Responsive, modern UI
- Secure authentication

## Tech Stack

### Backend
- Python 3.9+
- FastAPI
- SQLite
- JWT Authentication
- Twilio for SMS
- OpenWeather API integration

### Frontend
- HTML5/CSS3
- JavaScript
- Chart.js for visualizations
- Responsive design
- FontAwesome icons

## Local Development Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd water-monitoring-system
   ```

2. Set up Python virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install backend dependencies:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

4. Create `.env` file:
   Copy `.env.example` to `.env` and fill in your API keys:
   ```
   OPENWEATHER_API_KEY=your_key
   TWILIO_ACCOUNT_SID=your_sid
   TWILIO_AUTH_TOKEN=your_token
   TWILIO_PHONE_NUMBER=your_number
   SECRET_KEY=your_secret_key
   DATABASE_URL=sqlite:///./water_monitoring.db
   CORS_ORIGINS=http://localhost:5000,http://127.0.0.1:5000
   ```

5. Start the backend server:
   ```bash
   uvicorn main:app --reload
   ```

6. Open the frontend:
   ```bash
   cd ../frontend
   # Use any simple HTTP server, e.g.:
   python -m http.server 5000
   ```

7. Visit http://localhost:5000 in your browser

## Docker Deployment

1. Build the Docker image:
   ```bash
   docker build -t water-monitoring-system .
   ```

2. Run the container:
   ```bash
   docker run -p 8000:8000 --env-file .env water-monitoring-system
   ```

## API Documentation

Once the server is running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Environment Variables

| Variable | Description |
|----------|-------------|
| OPENWEATHER_API_KEY | Your OpenWeather API key |
| TWILIO_ACCOUNT_SID | Twilio Account SID |
| TWILIO_AUTH_TOKEN | Twilio Auth Token |
| TWILIO_PHONE_NUMBER | Twilio Phone Number |
| SECRET_KEY | JWT secret key |
| DATABASE_URL | SQLite database URL |
| CORS_ORIGINS | Allowed CORS origins |

## Project Structure

```
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   └── api/
│       ├── database.py
│       ├── models/
│       │   ├── models.py
│       │   └── schemas.py
│       └── routes/
│           ├── auth.py
│           ├── sensors.py
│           ├── weather.py
│           ├── hazards.py
│           └── alerts.py
├── frontend/
│   ├── index.html
│   ├── dashboard.html
│   ├── css/
│   │   ├── style.css
│   │   └── dashboard.css
│   └── js/
│       ├── main.js
│       └── dashboard.js
└── Dockerfile
```

## Security Considerations

1. Always use HTTPS in production
2. Keep API keys secure
3. Use environment variables
4. Implement rate limiting
5. Regular security updates

## Production Deployment

1. Set up SSL/TLS certificates
2. Configure proper CORS settings
3. Set up proper logging
4. Implement monitoring
5. Configure backup system

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details# WATER-MANAGMENT-SYSTEM
>>>>>>> 32990c6 (Add all water project files and folders)
