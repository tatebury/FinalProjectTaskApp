from . import bp as api
from app.models import *
from flask import make_response, request
from sqlalchemy import and_
import json




#### get task routes ####

# returns all public tasks
@api.get('/tasks')
def get_all_tasks():
    response_list = [task.to_dict() for task in Task.query.all() if task.is_public==True]
    return make_response({"tasks":response_list},200)

# returns all tasks made by a certain user
@api.get('/user/<int:user_id>/tasks')
def get_tasks_of_user(user_id):
    user = User.query.get(user_id)
    response_list = [task.to_dict() for task in user.tasks]
    return make_response({"tasks":response_list},200)

# returns a single task by a task id
@api.get('/tasks/<int:task_id>')
def get_single_task(task_id):
    task = Task.query.get(task_id)
    if not task:
        return make_response(f"Task ID: {task_id} does not exist.", 404)
    return make_response(task.to_dict(),200)




#### activation routes ####

# set a task's is_active value
@api.put('/tasks/<int:task_id>/setactive')
def set_task_active(task_id):
    task = Task.query.get(task_id)
    active = request.args.get('active')
    bonus = request.args.get('bonus')
    if not task:
        return make_response(f"Task ID: {task_id} does not exist.", 404)
    if active==None:
        return make_response(f"Missing query parameter: 'active'", 400)
    is_active = active.lower() in ('true', True, '1')
    is_bonus = False
    if bonus!=None:
        is_bonus = bonus.lower() in ('true', True, '1')
    task.set_active(active=is_active, bonus=is_bonus)
    return make_response(f"Task {task.id}; active={is_active}, bonus={is_bonus}",200)

# set all is_active and is_bonus values to False for a user's tasks
@api.put('/user/<int:user_id>/tasks/deactivateall')
def deactivate_all_tasks(user_id):
    tasks = Task.query.filter_by(user_id=user_id)
    
    for task in tasks:
        if task.is_active==True:
            task.set_active(active=False, bonus=False) 
            task.reset_task()
    return make_response(f"All tasks deactivated.",200)





#### completion routes ####

# complete a task and add to user points
@api.post('/user/<int:user_id>/tasks/<int:task_id>/complete')
def complete_task(user_id, task_id):
    task = Task.query.get(task_id)
    if not task:
        return make_response(f"Task ID: {task_id} does not exist.", 404)
    user = User.query.get(user_id)
    if not user:
        return make_response(f"User ID: {user_id} does not exist.", 404)
    task.complete_task()
    task.recalculate_points()
    bonus = False
    if request.args.get("bonus")!=None:
        if request.args.get("bonus").lower() in ("true", "1"):
            bonus = True
    if bonus==False:
        user.add_points(task.points)
    else:
        task.is_counted_as_bonus = True
        task.save()
        user.add_points(task.points * 2)
        
    return make_response(f"Task {task.id} completed by user {user.id}")

# uses the object with a list of active tasks to subtract points for incomplete tasks
# and reset all tasks to their inactive state
@api.post('/user/<int:user_id>/finish')
def finish_tasks(user_id):
    user = User.query.get(user_id)
    if not user:
        return make_response(f"User ID: {user_id} does not exist.", 404)
    
    for task in user.tasks:
        if task.is_active==True:
            if task.is_completed==False:
                task.skip_task()
                if task.is_bonus==False:
                    user.subtract_points(task.points)
                task.recalculate_points()
            task.reset_task()
            
    return make_response({"total_points":user.total_points}, 200)

@api.get('/user/<int:user_id>/completedtasks')
def get_completed_tasks(user_id):
    tasks = Task.query.filter_by(user_id=user_id)
    bonus_tasks = []
    main_tasks = []
    for task in tasks:
        if task.is_completed==True:
            if task.is_counted_as_bonus==True:
                bonus_tasks.append(task.to_dict())
            else:
                main_tasks.append(task.to_dict())
    return make_response({
        "main_tasks":main_tasks,
        "bonus_tasks":bonus_tasks
    }, 200)
    




#### task modding routes ####

# creates new task
@api.post('/tasks')
def create_task():
    task_data = request.args
    if task_data.get("user_id"):
        u = User.query.get(int(task_data['user_id']))
        if not u:
            return make_response(f"User id: {int(task_data['user_id'])} does not exist.", 404)
    else:
        return make_response(f"Missing 'user_id' query parameter", 400)
    task = Task()
    task.from_dict(task_data)
    task.save()
    task.recalculate_points()
    print(task)
    return make_response(f"Task id: {task.id} created.", 200)


# deletes a task
@api.delete('/tasks/<int:task_id>')
def delete_task(task_id):
    task = Task.query.get(task_id)
    if not task:
        return make_response(f"Task ID: {task_id} does not exist.", 404)
    task.delete()
    return make_response(f"task ID: {task_id} has been deleted.",200)



# edits a task
@api.put('/tasks/<int:task_id>')
def put_task(task_id):
    task_data = request.args
    task = Task.query.get(task_id)
    if not task:
        return make_response(f"task id: {int(task_data['id'])} does not exist.", 404)
    if task_data.get("user_id"):
        u = User.query.get(int(task_data['user_id']))
        if not u:
            return make_response(f"User id: {int(task_data['user_id'])} does not exist.", 404)
    task.from_dict(task_data)
    task.save()
    task.recalculate_points()
    return make_response(f"Task id: {task.id} has been changed.", 200)


