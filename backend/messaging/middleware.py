from django.contrib.auth.models import AnonymousUser
from rest_framework.authtoken.models import Token
from channels.db import database_sync_to_async
from urllib.parse import parse_qs

@database_sync_to_async
def get_user_from_token(token_key):
    try: 
        token = Token.objects.get(key=token_key)
        return token.user
    except Token.DoesNotExist:
        return None

class TokenAuthMiddleware:
    """
    Custom middleware to authenticate the WebSocket connection using a token.
    """

    def __init__(self, inner):
        self.inner = inner

    async def __call__(self, scope, receive, send):
        query_string = scope.get('query_string', b'').decode('utf-8')
        params = parse_qs(query_string)
        token_key = params.get('token', [None])[0]
        
        if token_key:
            user = await get_user_from_token(token_key)
            scope['user'] = user or AnonymousUser()

        return await self.inner(scope, receive, send)
