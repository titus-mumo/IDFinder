import os
import re
from rest_framework.views import APIView
from rest_framework import generics, status, views
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from django.core.files.storage import default_storage
from django.conf import settings
from .models import ID, IDClaim
from .serializers import IDSerializer, IDListSerializer, MyIDListSerializer, IDClaimSerializer
import pytesseract
from PIL import Image
from django.core.files.base import ContentFile
from django.http import JsonResponse
from .image_matcher import ImageMatcher
from django.utils import timezone
import uuid

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



    """ user submits a POST request to VerifyIDView with their ID number, personal details, and a selfie image.
The view verifies the provided information against the retrieved ID record and performs facial recognition using the ImageMatcher class.
If all checks pass, a success response is returned.
An admin can then approve or reject the user's verification claim through the ApproveIDClaim view. The claim status is updated accordingly, and relevant actions (e.g., marking the ID as claimed) are taken."""


class IDClaimView(generics.CreateAPIView):
    queryset = IDClaim.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = IDClaimSerializer

    def post(self, serializer):
        data = self.request.data
        primary_key = self.request.query_params.get('id_no')
        id_record = ID.objects.filter(primary_key = primary_key).first()
        data["id_found"] = id_record.primary_key
        data["user"] = self.request.user.id
        user_image = self.request.FILES.get('selfie')
        if user_image:
            temp_filename = f'temp_{uuid.uuid4()}.jpg'
            
            # Save the user image temporarily in the MEDIA_ROOT directory
            temp_file_path = default_storage.save(os.path.join('temp', temp_filename), ContentFile(user_image.read()))

            # Get the absolute path for the temp file
            temp_file_full_path = os.path.join(settings.MEDIA_ROOT, temp_file_path)
            matcher = ImageMatcher()
            match_score = matcher.compare_faces(temp_file_full_path, id_record.front_image.path)
            default_storage.delete(temp_file_full_path)
        data['image_match'] = match_score

        serializer = self.get_serializer(data = data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Claim submitted successfully"}, status=status.HTTP_201_CREATED)
        else:
            return Response({"error": serializer.errors}, status = status.HTTP_400_BAD_REQUEST)


from .serializers import ViewUserClaimSerializer

class UserClaimsView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ViewUserClaimSerializer

    def get_queryset(self):
        user = self.request.user
        return IDClaim.objects.filter(user = user)

class ApproveIDClaim(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request, claim_id):
        try:
            claim = IDClaim.objects.get(id=claim_id)
        except IDClaim.DoesNotExist:
            return Response({"detail": "Claim not found."}, status=404)

        action = request.data.get('action')  # Either 'approve' or 'reject'

        if action == 'approve':
            claim.claim_status = 'approved'
            claim.id_found.mark_as_claimed(claim.user)
        elif action == 'reject':
            claim.claim_status = 'rejected'
        else:
            return Response({"detail": "Invalid action."}, status=400)

        claim.save()
        return Response({"detail": f"Claim {claim.claim_status}"}, status=200)



class AdminDashBoard(views.APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        now = timezone.now()
        total_ids = ID.objects.count()
        total_ids_claimed = ID.objects.filter(id_status='Claimed').count()
        total_ids_found_this_month = ID.objects.filter(
            created_at__year=now.year,
            created_at__month=now.month
        ).count()
        total_ids_claimed_this_month = ID.objects.filter(
            id_status = 'Claimed',
            created_at__year=now.year,
            created_at__month=now.month
        ).count()
        return Response({
            "total_ids": total_ids,
            "total_ids_claimed": total_ids_claimed,
            "total_ids_found_this_month": total_ids_found_this_month,
            "total_ids_claimed_this_month": total_ids_claimed_this_month,
        }, status=status.HTTP_200_OK)

class IDDetail(views.APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        id_no = request.query_params.get('id_no')
        if not id_no:
            return Response({"error": "ID number is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        id_detail = ID.objects.filter(id_no=id_no).first()
        if id_detail:
            serializer = MyIDListSerializer(id_detail)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({"error": "ID not found"}, status=status.HTTP_404_NOT_FOUND)


class AdminIDClaimView(generics.ListAPIView):
    permission_classes = [IsAdminUser]
    serializer_class = ViewUserClaimSerializer
    
    def get_queryset(self):
        return IDClaim.objects.all()


from .serializers import ViewIDInClaimSerializer

class ClaimIDDetail(views.APIView):
    permission_classes = [IsAdminUser]
    
    def get(self, request):
        id_no = request.query_params.get('id_no')
        if not id_no:
            return Response({"error": "ID number is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        id_detail = ID.objects.filter(id_no=id_no).first()
        if id_detail:
            serializer = ViewIDInClaimSerializer(id_detail)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({"error": "ID not found"}, status=status.HTTP_404_NOT_FOUND)


