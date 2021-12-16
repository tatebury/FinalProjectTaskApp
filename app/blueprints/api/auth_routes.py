from . import bp as api
from app.models import User
from flask import make_response, request
from passlib.hash import sha256_crypt

@api.post('/token')
def get_token():
    u = User.query.filter_by(username=request.args.get("username")).first()
    stored_password = u.password
    if u and sha256_crypt.verify(request.args.get("password"), stored_password):
        token = u.get_token()
        return make_response(
            {
            "token":token, 
            "currentUserID":u.id, 
            "totalPoints":u.total_points
            },200)
    else:
        return make_response("Unauthorized Access", 401)
    

    
