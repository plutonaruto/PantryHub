import os
import firebase_admin
from firebase_admin import credentials


#cred = credentials.Certificate("/serviceAccountKey.json")
#firebase_admin.initialize_app(cred)


os.environ["FIREBASE_AUTH_EMULATOR_HOST"] = "localhost:9099"
default_app = firebase_admin.initialize_app() 