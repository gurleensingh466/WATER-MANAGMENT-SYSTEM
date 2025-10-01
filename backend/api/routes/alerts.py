from fastapi import APIRouter, Depends, HTTPException
from twilio.rest import Client
import os
from api.routes.auth import get_current_user
from api.models import models

router = APIRouter()

# Twilio configuration
TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
TWILIO_PHONE_NUMBER = os.getenv("TWILIO_PHONE_NUMBER")

client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

async def send_alert(severity: str, description: str, to_phone: str):
    try:
        message = client.messages.create(
            body=f"WATER ALERT - {severity}\n{description}",
            from_=TWILIO_PHONE_NUMBER,
            to=to_phone
        )
        return {"status": "success", "message_sid": message.sid}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/send")
async def send_manual_alert(
    message: str,
    current_user: models.User = Depends(get_current_user)
):
    if not current_user.phone_number:
        raise HTTPException(status_code=400, detail="User has no registered phone number")
    
    result = await send_alert("MANUAL ALERT", message, current_user.phone_number)
    return result