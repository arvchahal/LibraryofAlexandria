import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
import json

cred = credentials.Certificate('apiFolder/apiFolder/libofalex-8397c-firebase-adminsdk-v45ws-38bb278209.json')

firebase_admin.initialize_app(cred,{

  'databaseURL' : 'https://libofalex-8397c-default-rtdb.firebaseio.com/'
})

ref = db.reference("/")
ref = ref.get()
ref = json.dumps(ref,indent=4)

with open('tst.json','w') as f:
  f.write(ref)
print('done')