from datetime import datetime, timezone
from peewee import MySQLDatabase, Model, CharField, IntegerField, ForeignKeyField, TextField, DateTimeField, AutoField
from app.models.dbSetup import db, BaseModel
from app.models.FC_set import FC_Set as FC


class Card(BaseModel):
    question = TextField()
    answer = TextField()
    fc_set = ForeignKeyField(FC)
    created_at = DateTimeField(default=lambda: datetime.now(timezone.utc))
    updated_at = DateTimeField(default=lambda: datetime.now(timezone.utc))
    score = IntegerField(default=0)


if __name__=='__main__':
    db.connect()
    db.drop_tables([Card])
    db.create_tables([Card])
    db.close()