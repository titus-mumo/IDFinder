import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from id_finder.models import ID

class SearchConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
    
    async def disconnect(self, code):
        pass

    async def receive(self, text_data=None, bytes_data=None):
        data = json.loads(text_data)
        search_query = data.get('search_query', '')
        filtered_ids = await self.filter_ids(search_query)
        await self.send(text_data=json.dumps({"filtered_ids":filtered_ids}))

    @database_sync_to_async
    def filter_ids(self, search_query):
        if search_query:
            ids = list(ID.objects.filter(id_no__startswith=search_query).values_list('id_name', 'id_no'))
            modified_ids = [
                {"id_name": id_name.split()[0], "id_no": id_no[:4]}  # Take first word of name and 4 digits of number
                for id_name, id_no in ids
            ]
            return modified_ids
        return []
