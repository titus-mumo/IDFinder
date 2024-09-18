import os
import re
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from django.core.files.storage import default_storage
from django.conf import settings
from .models import ID
from .serializers import IDSerializer, IDListSerializer, MyIDListSerializer
import pytesseract
from PIL import Image
from django.core.files.base import ContentFile
from django.http import JsonResponse


class IDCreateView(generics.CreateAPIView):
    queryset = ID.objects.all()
    serializer_class = IDSerializer
    permission_classes = [IsAuthenticated]

    def post(self, serializer):
        data = self.request.data
        # id_number = self.request.data.get('id_no')
        # print(id_number)
        # # Check if the 'id_image' (front) and 'back_image' are in the request
        # id_image = self.request.data.get('front_image')
        # back_image = self.request.data.get('back_image')

        # if not id_image or not back_image:
        #     raise ValidationError({"error": "Both front and back ID images are required for OCR processing"})
        # print(id_image)
        # id_directory = os.path.join(settings.MEDIA_ROOT, id_number)
        # if not os.path.exists(id_directory):
        #     os.makedirs(id_directory)

        # # Save the images temporarily
        # # Save the front image
        # front_image_name = f"front_{id_image.name}"
        # front_image_path = os.path.join(id_directory, front_image_name)
        # front_image_saved_path = default_storage.save(front_image_path, ContentFile(id_image.read()))


        # print(back_image.name)
        # # Save the back image
        # back_image_name = f"back_{back_image.name}"
        # back_image_path = os.path.join(id_directory, back_image_name)
        # back_image_saved_path = default_storage.save(back_image_path, ContentFile(back_image.read()))
        # print(back_image_saved_path)
        # print("saved images")

        # try:
            # Convert the images to binary (black and white) to improve OCR accuracy
        # front_image = Image.open(front_image_saved_path).convert('L')
        # back_image = Image.open(back_image_saved_path).convert('L')

        # # Apply OCR processing using Tesseract
        # ocr_front_result = pytesseract.image_to_string(front_image)


        # # Define regex patterns for extracting relevant fields from OCR results
        # name_pattern = re.compile(r"([A-Z]+[ ]?)+")  # Matches names like KONSHENS OTIENO 
        # id_no_pattern = re.compile(r"\b\d{8}\b")  # Matches an 8-digit ID number
        # dob_pattern = re.compile(r"(\d{2}\.\d{2}\.\d{4}|\d{4}-\d{2}-\d{2})")  # Matches dates in DD.MM.YYYY or YYYY-MM-DD format
        # gender_pattern = re.compile(r"\b(MALE|FEMALE)\b", re.IGNORECASE)  # Matches gender
        # district_pattern = re.compile(r"(DISTRICT|PLACE OF ISSUE):?\s*([A-Z]+[ ]?[A-Z]*)", re.IGNORECASE)  # Matches district information
        # sn_pattern = re.compile(r"\bSN[:\s]*([A-Z0-9]{8,12})\b", re.IGNORECASE)  # Matches serial number (e.g., SN: 0022040285)
        # date_of_issue_pattern = re.compile(r"DATE OF ISSUE:?\s*(\d{2}/\d{2}/\d{4})", re.IGNORECASE)  # Matches date of issue (e.g., Date of Issue: 01/04/2020)

        # # Use regex to find the details in OCR results
        # id_name = name_pattern.search(ocr_front_result).group(0) if name_pattern.search(ocr_front_result) else "Unknown"
        # id_no = id_no_pattern.search(ocr_front_result).group(0) if id_no_pattern.search(ocr_front_result) else "Unknown"
        # date_of_birth = dob_pattern.search(ocr_front_result).group(0) if dob_pattern.search(ocr_front_result) else "Unknown"
        # gender = gender_pattern.search(ocr_front_result).group(0).capitalize() if gender_pattern.search(ocr_front_result) else "Unknown"
        # district_of_birth = district_pattern.search(ocr_front_result).group(2) if district_pattern.search(ocr_front_result) else "Unknown"
        # sn = sn_pattern.search(ocr_front_result).group(1) if sn_pattern.search(ocr_front_result) else "Unknown"
        # date_of_issue = date_of_issue_pattern.search(ocr_front_result).group(1) if date_of_issue_pattern.search(ocr_front_result) else "Unknown"

        # Call the serializer to save the data, passing the extracted OCR data
        data["user"] = self.request.user.id
        serializer = self.get_serializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse({"message": "ID saved successfully"}, status=status.HTTP_201_CREATED)
        else:
            return JsonResponse({"error": serializer.errors}, status = status.HTTP_400_BAD_REQUEST)

        # except Exception as e:
        #     raise ValidationError({"error": f"An error occurred during OCR processing: {str(e)}"})

        # finally:
        #     # Clean up the temporary image files
        #     if os.path.exists(front_image_path):
        #         os.remove(front_image_path)
        #     if os.path.exists(back_image_path):
        #         os.remove(back_image_path)

class IDListView(generics.ListAPIView):
    serializer_class = IDListSerializer  # Serializer with limited fields (id_name, partial id_no)
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Get all IDs with partial ID number display
        ids = ID.objects.exclude(user = self.request.user)

        # Blur out part of the ID number (e.g., 1234****)
        for id in ids:
            id.id_no = id.id_no[:4] + "****"  # Show only the first 4 digits

        return ids

class MyIDListView(generics.ListAPIView):
    serializer_class = MyIDListSerializer  # Serializer with all fields for the user's uploads
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ID.objects.filter(user=self.request.user)  # Return only IDs uploaded by the logged-in user
