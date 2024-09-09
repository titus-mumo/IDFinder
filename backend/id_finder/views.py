import os
import re
from rest_framework import generics
from .models import ID
from .serializers import IDSerializer, IDListSerializer
from rest_framework.permissions import IsAuthenticated
from django.core.files.storage import default_storage
from rest_framework import status
from rest_framework.response import Response
import pytesseract
from PIL import Image
from rest_framework.exceptions import ValidationError
from django.conf import settings

class IDCreateView(generics.CreateAPIView):
    queryset = ID.objects.all()
    serializer_class = IDSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        # Check if the 'id_image' (front) and 'back_image' are in the request
        id_image = self.request.FILES.get('id_image', None)
        back_image = self.request.FILES.get('back_image', None)

        if not id_image or not back_image:
            raise ValidationError({"error": "Both front and back ID images are required for OCR processing"})

        # Save the images temporarily
        front_image_path = os.path.join(settings.MEDIA_ROOT, id_image.name)
        back_image_path = os.path.join(settings.MEDIA_ROOT, back_image.name)
        
        with default_storage.open(front_image_path, 'wb+') as destination:
            for chunk in id_image.chunks():
                destination.write(chunk)

        with default_storage.open(back_image_path, 'wb+') as destination:
            for chunk in back_image.chunks():
                destination.write(chunk)

        try:
            # Convert the images to binary (black and white) to improve OCR accuracy
            front_image = Image.open(front_image_path).convert('L')
            back_image = Image.open(back_image_path).convert('L')

            # Apply OCR processing using Tesseract
            ocr_front_result = pytesseract.image_to_string(front_image)
            ocr_back_result = pytesseract.image_to_string(back_image)

            # Define regex patterns for extracting relevant fields from OCR results
            name_pattern = re.compile(r"([A-Z]+[ ]?)+")  # Matches names like KONSHENS OTIENO 
            id_no_pattern = re.compile(r"\b\d{8}\b")  # Matches an 8-digit ID number
            dob_pattern = re.compile(r"(\d{2}\.\d{2}\.\d{4}|\d{4}-\d{2}-\d{2})")  # Matches dates in DD.MM.YYYY or YYYY-MM-DD format
            gender_pattern = re.compile(r"\b(MALE|FEMALE)\b", re.IGNORECASE)  # Matches gender
            district_pattern = re.compile(r"(DISTRICT|PLACE OF ISSUE):?\s*([A-Z]+[ ]?[A-Z]*)", re.IGNORECASE)  # Matches district information
            sn_pattern = re.compile(r"\bSN[:\s]*([A-Z0-9]{8,12})\b", re.IGNORECASE)  # Matches serial number (e.g., SN: 0022040285)
            date_of_issue_pattern = re.compile(r"DATE OF ISSUE:?\s*(\d{2}/\d{2}/\d{4})", re.IGNORECASE)  # Matches date of issue (e.g., Date of Issue: 01/04/2020)

            # Use regex to find the details in OCR results
            id_name = name_pattern.search(ocr_front_result).group(0) if name_pattern.search(ocr_front_result) else "Unknown"
            id_no = id_no_pattern.search(ocr_front_result).group(0) if id_no_pattern.search(ocr_front_result) else "Unknown"
            date_of_birth = dob_pattern.search(ocr_front_result).group(0) if dob_pattern.search(ocr_front_result) else "Unknown"
            gender = gender_pattern.search(ocr_front_result).group(0).capitalize() if gender_pattern.search(ocr_front_result) else "Unknown"
            district_of_birth = district_pattern.search(ocr_front_result).group(2) if district_pattern.search(ocr_front_result) else "Unknown"
            sn = sn_pattern.search(ocr_front_result).group(1) if sn_pattern.search(ocr_front_result) else "Unknown"
            date_of_issue = date_of_issue_pattern.search(ocr_front_result).group(1) if date_of_issue_pattern.search(ocr_front_result) else "Unknown"

            # Call the serializer to save the data, passing the extracted OCR data
            serializer.save(
                user=self.request.user,
                id_name=id_name,
                sn=sn,
                id_no=id_no,
                date_of_birth=date_of_birth,
                gender=gender,
                district_of_birth=district_of_birth,
                date_of_issue=date_of_issue,
                id_image=id_image,  # Storing the original front image
                id_status="Found"
            )

        except Exception as e:
            raise ValidationError({"error": f"An error occurred during OCR processing: {str(e)}"})

        finally:
            # Clean up the temporary image files
            if os.path.exists(front_image_path):
                os.remove(front_image_path)
            if os.path.exists(back_image_path):
                os.remove(back_image_path)
class IDListView(generics.ListAPIView):
    serializer_class = IDListSerializer  # Serializer with limited fields (id_name, id_no)
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ID.objects.all()  # Return all IDs with limited info (home view)

class MyIDListView(generics.ListAPIView):
    serializer_class = IDSerializer  # Serializer with all fields
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ID.objects.filter(user=self.request.user)  # Return only IDs found by the user
