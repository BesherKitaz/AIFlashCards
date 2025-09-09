from peewee import MySQLDatabase, Model, CharField, IntegerField, ForeignKeyField, TextField , DateTimeField
from datetime import datetime, timezone
from .dbSetup import db, BaseModel

class FC_Set(BaseModel):
    id = IntegerField(primary_key=True)
    name = CharField(unique=True)
    description = TextField(null=True)
    created_at = DateTimeField(default=datetime.now(timezone.utc))
    updated_at = DateTimeField(default=datetime.now(timezone.utc))

if __name__=='__main__':
    db.connect()
    db.drop_tables([FC_Set])
    db.create_tables([FC_Set])
    db.close()