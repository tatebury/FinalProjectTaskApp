from . import bp as api
from app.models import User
from flask import make_response, request



#### user start tasks routes #### 

# sets is_started value of a user
@api.put('/user/<int:user_id>/start')
def set_is_started(user_id):
    user = User.query.get(user_id)
    started = request.args.get('started')
    if not user:
        return make_response(f"User ID: {user_id} does not exist.", 404)
    if not started:
        return make_response(f"Missing query parameter: 'started'", 400)
    user.set_started(started.lower() in ('true', True, '1'))
    return make_response(f"For user #{user.id}, is_started is now {f'{user.is_started}'.lower()}.",200)

# returns is_started boolean value of a user
@api.get('/user/<int:user_id>/isstarted')
def get_is_started(user_id):
    user = User.query.get(user_id)
    if not user:
        return make_response(f"User ID: {user_id} does not exist.", 404)
    return make_response({"is_started":user.is_started}, 200)




#### user points routes ####

@api.get('/user/<int:user_id>/points')
def get_points(user_id):
    user = User.query.get(user_id)
    if not user:
        return make_response(f"User ID: {user_id} does not exist.", 404)
    return make_response({"total_points":user.total_points}, 200)

@api.put('/user/<int:user_id>/addpoints/<int:points>')
def add_points(user_id, points):
    user = User.query.get(user_id)
    if not user:
        return make_response(f"User ID: {user_id} does not exist.", 404)
    # user.set_points_to_zero()
    user.add_points(points)
    return make_response(f"User #{user.id} now has {user.total_points} points.",200)

@api.put('/user/<int:user_id>/subtractpoints/<int:points>')
def subtract_points(user_id, points):
    user = User.query.get(user_id)
    if not user:
        return make_response(f"User ID: {user_id} does not exist.", 404)
    # user.set_points_to_zero()
    user.subtract_points(points)
    return make_response(f"User #{user.id} now has {user.total_points} points.",200)




#### user get routes ####

# returns all users
@api.get('/user')
def get_users():
    users_data=[user.to_dict() for user in User.query.all()]
    return make_response({"users":users_data}, 200)

# returns a user by an ID
@api.get('/user/<int:id>')
def get_user(id):
    return make_response(User.query.get(id).to_dict(), 200)





#### user modding routes ####

# create a new user from registration data
@api.post('/user')
def post_user():
    # query_params is an ImmutableMultiDict
    query_params = request.args
    new_data = {
        "first_name":None,
        "last_name":None,
        "username":None,
        "password":None,
        "icon":None,
        "is_admin":None
    }
    for key in query_params:
        value = query_params.get(key)
        new_data[key]=value
        
    # new_data['is_admin']=True
    
    new_user = User()
    new_user.from_dict(new_data)
    new_user.save()
    return make_response(f"New user ID: {id} created",200)

# edits a user by an ID
@api.put('/user/<int:id>')
def put_user(id):
    query_params = request.args
    user=User.query.get(id)
    dif_data = user.to_dict()
    for key in query_params:
        value = query_params.get(key)
        dif_data[key]=value
    dif_data['password']=None
    print(dif_data)
    user.from_dict(dif_data)
    user.save()
    return make_response(f"User ID: {id} modified",200)

# deletes a user by an ID
@api.delete('/user/<int:id>')
def delete_user(id):
    User.query.get(id).delete()
    return make_response(f"User ID: {id} deleted",200)

@api.post('/user/<int:user_id>/edittask/<int:edit_id>')
def set_edit_id(user_id, edit_id):
    user = User.query.get(user_id)
    if not user:
        return make_response(f"User ID: {user_id} does not exist.", 404)
    user.edit = edit_id
    user.save()
    return make_response(f"User ID: {user_id} is editing task {edit_id}",200)
    