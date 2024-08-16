from django.urls import path
from .views import RoomView

urlpatterns = [
    path('create_room/', RoomView.as_view())
]
