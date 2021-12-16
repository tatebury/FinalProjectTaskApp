from app import db
from flask_login import UserMixin
from datetime import datetime as dt, timedelta
import secrets
from passlib.hash import sha256_crypt


class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(150))
    last_name = db.Column(db.String(150))
    username = db.Column(db.String(200), unique=True, index=True)
    password = db.Column(db.String(200))
    icon = db.Column(db.Integer)
    created_on = db.Column(db.DateTime, default=dt.utcnow)
    
    total_points = db.Column(db.Integer, default=0)
    
    tasks = db.relationship('Task', backref='author', lazy='dynamic')
    
    token = db.Column(db.String, index=True, unique=True)
    token_exp = db.Column(db.DateTime)
    is_admin = db.Column(db.Boolean, default=False)
    is_started = db.Column(db.Boolean, default=False)
    edit = db.Column(db.Integer, default=0)


    def get_token(self, exp=86400):
        current_time = dt.utcnow()
        # give the user their token if the token is not expired
        if self.token and self.token_exp > current_time + timedelta(seconds=60):
            return self.token
        # if not a token create a token and exp date
        self.token = secrets.token_urlsafe(32)
        self.token_exp = current_time + timedelta(seconds=exp)
        self.save()
        return self.token

    def revoke_token(self):
        self.token_exp = dt.utcnow() - timedelta(seconds=61)

    @staticmethod
    def check_token(token):
        u = User.query.filter_by(token=token).first()
        if not u or u.token_exp < dt.utcnow():
            return None
        return u


    def set_started(self, started=True):
        self.is_started = started
        self.save()
        
    def add_points(self, points):
        self.total_points += points
        self.check_minus_points()
        self.save()
        
    def subtract_points(self, points):
        self.total_points -= points
        self.check_minus_points()
        self.save()
        
    def check_minus_points(self):
        if self.total_points < 0:
            self.total_points = 0
            self.save()
            
    def set_points_to_zero(self):
        self.total_points = 0
        self.save()

    def from_dict(self, data):
        self.first_name = data['first_name']
        self.last_name = data['last_name']
        self.username = data["username"]
        if data['password']!=None:
            self.password = sha256_crypt.encrypt(data['password'])
        if data['icon']!=None:
            self.icon = int(data['icon'])
        if type(data['is_admin'])==str:
            admin = data['is_admin'].lower() in ('true', '1')
            self.is_admin = admin
        elif type(data['is_admin'])==bool:
            admin = data['is_admin']
            self.is_admin = admin
        
    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "total_points": self.total_points,
            "icon": self.icon,
            "edit": self.edit,
            "created_on": self.created_on,
            "is_admin": self.is_admin
            }

    def save(self):
        db.session.add(self)
        db.session.commit()
        
    def delete(self):
        db.session.delete(self)
        db.session.commit()
    
    def get_icon_url(self):
        return f'https://avatars.dicebear.com/api/micah/{self.icon}.svg'

    def __repr__(self):
        return f'<User: {self.id} | {self.email}>'


class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), index=True, default="My Task")
    description = db.Column(db.String(500))
    steps = db.Column(db.String(500))
    importance = db.Column(db.Integer, index=True)
    color = db.Column(db.String(50), default="rgb(0, 114, 207)")
    time = db.Column(db.Integer, index=True) #stored in seconds
    is_public = db.Column(db.Boolean, index=True, default=False)
    
    popularity = db.Column(db.Integer, index=True)
    points = db.Column(db.Integer, index=True, default=10)
    is_active = db.Column(db.Boolean, default=False)
    is_bonus = db.Column(db.Boolean, default=False)
    is_completed = db.Column(db.Boolean, default=False)
    date_created = db.Column(db.DateTime, default=dt.utcnow)
    date_updated = db.Column(db.DateTime, onupdate=dt.utcnow)
    
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    times_attempted = db.Column(db.Integer, index=True, default=0)
    times_completed = db.Column(db.Integer, index=True, default=0)
    
    def from_dict(self, data):
        if data.get("name")!=None:
            self.name = data["name"]
        if data.get("description")!=None:
            self.description = data["description"]
        if data.get("steps")!=None:
            self.steps = data["steps"]
        if data.get("importance")!=None:
            importance = int(data["importance"])
            if importance<1:
                importance = 1
            elif importance>10:
                importance = 10
            self.color = self.get_color(importance)
            self.importance = importance
            
        if data.get("time")!=None:
            self.time = int(data["time"]) * 60
        if data.get("popularity")!=None:
            self.popularity = int(data["popularity"])
        if data.get("points")!=None:
            self.points = int(data["points"])
        if data.get("is_public")!=None:
            self.is_public = data["is_public"].lower() in (True, "true", 1)
        if data.get("user_id")!=None:
            self.user_id = int(data["user_id"])
            
        ###### remove before production ##### 
        if type(data.get("reset")) == str:
            if data.get("reset").lower() in ("true", "1"):
                # self.points = 10
                self.is_completed = False
                self.times_completed = 0
                self.times_attempted = 0
            
            
        
    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "steps": self.steps,
            "importance": self.importance,
            "color": self.color,
            "time": self.time,
            "popularity": self.popularity,
            "points": self.points,
            "is_public": self.is_public,
            "is_active": self.is_active,
            "is_bonus": self.is_bonus,
            "is_completed": self.is_completed,
            
            "times_completed": self.times_completed,
            "times_attempted": self.times_attempted,
            
            "date_created": self.date_created,
            "date_updated": self.date_updated,
            "user_id": self.user_id
            }
        
    def set_active(self, active=True, bonus=False):
        self.is_active = active
        self.is_bonus = bonus
        self.save()
        
        
    def complete_task(self):
        self.is_completed = True
        self.times_attempted += 1
        self.times_completed += 1
        self.save() 
        
    
    def skip_task(self):
        self.times_attempted += 1
        self.save()

    def reset_task(self):
        self.is_completed = False
        self.is_active = False
        self.is_bonus = False
        self.save()
        
    def recalculate_points(self):
        if self.times_completed>0:
            multiplier = self.times_attempted / self.times_completed
            if multiplier>1:
                if multiplier>1.5:
                    multiplier = 1.5
                self.points = int(self.importance * 6 * multiplier)
            else:
                self.points = int(self.importance * 6)
        else:
            self.points = int(self.importance * 6)
        self.save()
        return self.points
    
    
    def get_color(self, importance):
        blue_red = {
            1 : "rgb(0, 130, 230)",
            2 : "rgb(33, 93, 250)",
            3 : "rgb(80, 26, 235)",
            4 : "rgb(105, 9, 210)",
            5 : "rgb(125, 4, 195)",
            6 : "rgb(155, 0, 170)",
            7 : "rgb(170, 0, 118)",
            8 : "rgb(189, 0, 85)",
            9 : "rgb(221, 0, 50)",
            10 : "rgb(230, 0, 0)",
        }
        return blue_red[importance]
        
        
        
    def save(self):
        db.session.add(self)
        db.session.commit()

    def edit(self, new_body):
        self.body=new_body
        self.save()
    
    def delete(self):
        db.session.delete(self)
        db.session.commit()
    
    def __repr__(self):
        return f'<id:{self.id} | Task: {self.name[:15]}>'
