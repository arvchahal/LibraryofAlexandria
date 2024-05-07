# Django views.py
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import firebase_admin
from firebase_admin import auth, db

if not firebase_admin._apps:
    cred = firebase_admin.credentials.Certificate('./apiFolder/libofalex-8397c-firebase-adminsdk-v45ws-38bb278209.json')
    firebase_admin.initialize_app(cred, {
        'databaseURL': 'https://libofalex-8397c-default-rtdb.firebaseio.com/'
    })

#@csrf_exempt
# def get_user_books(request, uid):
#     if request.method == 'GET':
#         auth_header = request.headers.get('Authorization')
#         if not auth_header or not auth_header.startswith('Bearer '):
#             return JsonResponse({'error': 'No or incorrect token provided'}, status=401)

#         token = auth_header.split('Bearer ')[1]
#         try:
#             decoded_token = auth.verify_id_token(token)
#             user_uid = decoded_token['uid']
#             if user_uid != uid:
#                 return JsonResponse({'error': 'Unauthorized access'}, status=403)
#         except Exception as e:
#             return JsonResponse({'error': 'Authentication failed', 'details': str(e)}, status=401)

#         ref = db.reference(f"/userBooks/{uid}")
#         data = ref.get()
#         return JsonResponse(data if isinstance(data, dict) else {'error': 'No data found'}, safe=False)

#     else:
#         return JsonResponse({'error': 'Method not allowed'}, status=405)
@csrf_exempt
def get_user_books(request, uid):
    if request.method == 'GET':
        try:
            # Directly use the uid passed in the URL for testing
            ref = db.reference(f"/userBooks/LfAJT0xxa4RKZs7DKTda2YiEUvA3")
            data = ref.get()
            return JsonResponse(data if isinstance(data, dict) else {'error': 'No data found'}, safe=False)
        except Exception as e:
            return JsonResponse({'error': 'Failed to fetch data', 'details': str(e)}, status=500)

    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)