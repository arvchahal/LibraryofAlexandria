from django.urls import path
from . import views
from django.views.generic import RedirectView

urlpatterns = [
    path('', RedirectView.as_view(url='home/')),
    path('get-user-books/<str:uid>/', views.get_user_books_and_recommendations, name='get_user_books'),
    #path('get-data/', views.get_all_user_books, name='get_data'),  # Consider using a more specific path
]
