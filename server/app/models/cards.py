from datetime import datetime, timezone
from peewee import  IntegerField, ForeignKeyField, TextField, DateTimeField, FloatField, DateField
from app.models.dbSetup import db, BaseModel
from app.models.FC_set import FC_Set as FC
from datetime import date

class Card(BaseModel):
    question = TextField()
    answer = TextField()
    fc_set = ForeignKeyField(FC)
    created_at = DateTimeField(default=lambda: datetime.now(timezone.utc))
    updated_at = DateTimeField(default=lambda: datetime.now(timezone.utc))



    def review(self, grade: int):
        """Update flashcard scheduling based on SM-2 algorithm"""
        if grade < 3:
            self.repetitions = 0
            self.interval = 1
        else:
            if self.repetitions == 0:
                self.interval = 1
            elif self.repetitions == 1:
                self.interval = 6
            else:
                self.interval = round(self.interval * self.ease_factor)
            self.repetitions += 1

        # Update ease factor
        self.ease_factor += (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02))
        if self.ease_factor < 1.3:
            self.ease_factor = 1.3

        # Update due date
        self.due_date = date.today() + timedelta(days=self.interval)

        # Save changes to DB
        self.save()


if __name__=='__main__':
    db.connect()
    db.drop_tables([Card])
    db.create_tables([Card])
    db.close()