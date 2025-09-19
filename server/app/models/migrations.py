# To run this file, go to ./server and type: 
# python -m app.models.migrations



from app.models.dbSetup import db

# Add any models to create in here:
from app.models.users import User
from app.models.FC_set import FC_Set
from app.models.cards import Card




if __name__ == "__main__":
    db.connect()
    db.drop_tables([Card, FC_Set])
    db.create_tables([FC_Set, Card])
    db.close()
    print("Tables created successfully!")   