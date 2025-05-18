import os
from dotenv import load_dotenv

load_dotenv()  

DB_USER = os.getenv('DB_USER', 'appuser')   
DB_PASS = os.getenv('DB_PASS', 'pantryhub101')           
DB_HOST = os.getenv('DB_HOST', 'localhost')  
DB_NAME = os.getenv('DB_NAME', 'pantryhub')  

DATABASE_URI = f"mysql+pymysql://{DB_USER}:{DB_PASS}@{DB_HOST}/{DB_NAME}"
