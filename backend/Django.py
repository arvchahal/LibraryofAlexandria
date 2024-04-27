from django.contrib import auth as django_auth
from django.http import JsonResponse
from django.contrib.auth.models import User
from firebase_admin import auth as firebase_auth
from firebase_admin import credentials, initialize_app

# Initialize Firebase Admin
cred = credentials.Certificate('../libofalex-8397c-firebase-adminsdk-v45ws-290e67414f.json')
default_app = initialize_app(cred)

# Django view
def authenticate_user(request):
    id_token = request.POST.get('id_token')

    try:
        # Verify the Firebase ID token and decode it
        decoded_token = firebase_auth.verify_id_token(id_token)
        email = decoded_token.get('email')
        display_name = decoded_token.get('name')

        # Check if the user exists in Django's database
        django_user = User.objects.filter(email=email).first()

        if django_user:
            # User already exists, log in the user
            django_auth.login(request, django_user)
        else:
            # User does not exist, create a new Django user
            django_user = User.objects.create_user(email=email, username=email)
            django_user.save()
            django_auth.login(request, django_user)

        # Return a success response
        return JsonResponse({'message': 'User authenticated successfully.', 'email': email, 'display_name': display_name})

    except firebase_auth.AuthError as e:
        # Handle Firebase Auth exceptions
        return JsonResponse({'error': str(e)}, status=400)

    except Exception as e:
        # General error handling
        return JsonResponse({'error': str(e)}, status=500)
