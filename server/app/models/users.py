
from datetime import datetime, timezone
from peewee import MySQLDatabase, Model, CharField, IntegerField, ForeignKeyField, TextField, DateTimeField
from .dbSetup import db, BaseModel

class User(BaseModel):
    id = IntegerField(primary_key=True)
    username = CharField(unique=True)
    email = CharField(unique=True)
    password_hash = CharField()
    created_at = DateTimeField(default=datetime.now(timezone.utc))
    updated_at = DateTimeField(default=datetime.now(timezone.utc))

if __name__=='__main__':
    db.connect()
    db.drop_tables([User])
    db.create_tables([User])
    db.close()