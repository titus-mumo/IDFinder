from django.urls import re_path
from . import consumers

websocket_search_urlpatterns = [
    re_path(r"ws/search/", consumers.SearchConsumer.as_asgi()),  # Use the room_name
]
