from datetime import datetime, timezone
from peewee import MySQLDatabase, Model, CharField, IntegerField, ForeignKeyField, TextField, DateTimeField
from .dbSetup import db, BaseModel

class Card(BaseModel):
    id = IntegerField(primary_key=True)
    question = TextField()
    answer = TextField()
    fc_set = ForeignKeyField('FC_Set', backref='cards')
    created_at = DateTimeField(default=datetime.now(timezone.utc))
    updated_at = DateTimeField(default=datetime.now(timezone.utc))
    score = IntegerField(default=0)
    

if __name__=='__main__':
    db.connect()
    db.drop_tables([Card])
    db.create_tables([Card])
    db.close()