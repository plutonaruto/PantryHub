from sqlalchemy import create_engine
from config import DATABASE_URI
from base import Base

import models 

engine = create_engine(DATABASE_URI)

Base.metadata.create_all(engine)
print("✅ items table created", DATABASE_URI)
