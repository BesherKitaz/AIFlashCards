
from datetime import datetime, timezone
from peewee import MySQLDatabase, Model, CharField, IntegerField, ForeignKeyField, TextField, DateTimeField, AutoField
from app.models.dbSetup import db, BaseModel

class User(BaseModel):
    username = CharField(unique=True)
    email = CharField(unique=True)
    password_hash = CharField()
    created_at = DateTimeField(default=lambda: datetime.now(timezone.utc))
    updated_at = DateTimeField(default=lambda: datetime.now(timezone.utc))

if __name__=='__main__':
    db.connect()
    db.drop_tables([User])
    db.create_tables([User])
    db.close()