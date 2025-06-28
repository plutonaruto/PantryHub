import os
os.environ["FIREBASE_AUTH_EMULATOR_HOST"] = "localhost:9099"

import firebase_admin
from firebase_admin import credentials, auth


#cred = credentials.Certificate("/serviceAccountKey.json")
#firebase_admin.initialize_app(cred)



default_app = firebase_admin.initialize_app(options={"projectId": "pantryhub-login-and-flow"})

# manually set admins 
uid = "MDnixcRW4ndSAtjlWnDmDhW2uFK7"

try:
    user = auth.get_user(uid)
    print("user found:", user.uid)

    auth.set_custom_user_claims(uid, {"role": "admin"})
    print(f"uid {uid} set as admin")
except auth.UserNotFoundError:
    print(f"user {uid} not found in the emulator")