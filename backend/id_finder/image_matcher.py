import boto3
from django.conf import settings

class ImageMatcher:
    """
    This class provides a wrapper for Amazon Rekognition service to compare faces in images.
    It utilizes AWS credentials and region information from Django and .env.
    """
    def __init__(self):
        self.client = boto3.client(
            'rekognition',
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_REGION
        )

    def compare_faces(self, source_image_path, target_image_path):
        """
        Compares faces in two images using Amazon Rekognition.

        Args:
            source_image_path (str): Path to the source image file.
            target_image_path (str): Path to the target image file.

        Returns:
            float: Similarity score (0.0 to 100.0) between the most similar faces in the images,
                   or 0.0 if no match is found.
        """
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
