from pydantic import BaseModel

class LoginRequest(BaseModel):
    name: str
    password: str

class AdminRequest(BaseModel):
    name: str
    password: str

class LoginResponse(BaseModel):
    message: str
    user: dict