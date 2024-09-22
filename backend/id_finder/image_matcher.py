import boto3
from django.conf import settings

class ImageMatcher:
    def __init__(self):
        self.client = boto3.client(
            'rekognition',
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_REGION
        )

    def compare_faces(self, source_image_path, target_image_path):
        with open(source_image_path, 'rb') as source_file:
            source_bytes = source_file.read()
        with open(target_image_path, 'rb') as target_file:
            target_bytes = target_file.read()

        response = self.client.compare_faces(
            SourceImage={'Bytes': source_bytes},
            TargetImage={'Bytes': target_bytes},
            SimilarityThreshold=80  
        )

        # Extract similarity score from the response
        if response['FaceMatches']:
            return response['FaceMatches'][0]['Similarity']
        else:
            return 0  # No match found
