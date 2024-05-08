from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import firebase_admin
from firebase_admin import auth, db
from .MLReccs import run_recommendation_total_system
import logging

logger = logging.getLogger(__name__)

# Initialize Firebase Admin SDK
if not firebase_admin._apps:
    cred = firebase_admin.credentials.Certificate('./apiFolder/libofalex-8397c-firebase-adminsdk-v45ws-38bb278209.json')
    firebase_admin.initialize_app(cred, {
        'databaseURL': 'https://libofalex-8397c-default-rtdb.firebaseio.com/'
    })

@csrf_exempt
def get_user_books_and_recommendations(request, uid):
    if request.method == 'GET':
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return JsonResponse({'error': 'No or incorrect token provided'}, status=401)

        token = auth_header.split('Bearer ')[1]
        try:
            decoded_token = auth.verify_id_token(token)
            user_uid = decoded_token['uid']
            if user_uid != uid:
                return JsonResponse({'error': 'Unauthorized access'}, status=403)
        except Exception as e:
            logger.error(f'Authentication failure: {str(e)}')
            return JsonResponse({'error': 'Authentication failed', 'details': str(e)}, status=401)

        try:
            # Fetch user books from Firebase
            ref = db.reference(f"/userBooks/{uid}")
            user_books = ref.get()
            if not user_books:
                return JsonResponse({'error': 'No data found'}, status=404)

            # Generate recommendations based on user books
            recommendations = run_recommendation_total_system(user_books)  # Adjust this to pass relevant data

            # Store the recommendations in Firebase under userRecs/userid/
            recs_ref = db.reference(f"/userRecs/{uid}")
            recs_ref.set({
                'recommendations': recommendations
            })

            return JsonResponse({'books': user_books, 'recommendations': recommendations})
        except Exception as e:
            logger.error(f'Recommendation system failure: {str(e)}')
            return JsonResponse({'error': 'Failed to generate recommendations', 'details': str(e)}, status=500)

    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)
