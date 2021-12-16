from flask import Blueprint

bp = Blueprint('api',__name__,url_prefix='')

from .import auth_routes, task_routes, user_routes