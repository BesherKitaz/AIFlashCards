import json
import os
from peewee import MySQLDatabase, Model


config_path = os.path.join(os.path.dirname(__file__), 'db.config.json')
with open(config_path, 'r') as dbconfig:
    database = json.load(dbconfig)
    

db = MySQLDatabase(    
    database['name'],
    user=database['user'],
    password=database['password'],
    host=database['host'],  
    port=3306,
)

class BaseModel(Model):
    """A base model that will use our MySQL database"""
    class Meta:
        database = db

