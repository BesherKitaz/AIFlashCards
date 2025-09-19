
from peewee import MySQLDatabase, Model, CharField, IntegerField, ForeignKeyField, TextField , DateTimeField, AutoField
from datetime import datetime, timezone
from app.models.dbSetup import db, BaseModel
from app.models.users import User

class FC_Set(BaseModel):
    owner = ForeignKeyField(User, backref='fc_sets')
    name = CharField()
    description = TextField(null=True)
    created_at = DateTimeField(default=lambda: datetime.now(timezone.utc))
    updated_at = DateTimeField(default=lambda: datetime.now(timezone.utc))

if __name__=='__main__':
    db.connect()
    db.drop_tables([FC_Set])
    db.create_tables([FC_Set])  
    db.close()