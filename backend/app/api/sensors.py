from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def get_sensors():
    return {"message": "Sensor API placeholder"}
