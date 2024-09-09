from django.contrib import admin
from .models import ID
from django.contrib.auth import get_user_model
from django.utils.html import format_html

CustomUser = get_user_model()

@admin.register(ID)
class IDAdmin(admin.ModelAdmin):
    list_display = ('id_name', 'id_no', 'date_of_birth', 'gender', 'district_of_birth', 'date_of_issue', 'id_status', 'user', 'id_image_tag')
    list_filter = ('gender', 'district_of_birth', 'id_status', 'date_of_issue')
    search_fields = ('id_name', 'id_no', 'sn', 'district_of_birth')
    readonly_fields = ('id_image_tag',)
    
    def id_image_tag(self, obj):
        if obj.id_image:
            return format_html(f'<img src="{obj.id_image.url}" width="100" height="100" />')
        return "No Image"
    id_image_tag.short_description = 'ID Image'

    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        if request.user.is_superuser:
            return queryset
        return queryset.filter(user=request.user)

@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'is_staff')
    list_filter = ('is_staff', 'is_superuser', 'is_active')
    search_fields = ('username', 'email')
    ordering = ('username',)
    readonly_fields = ('date_joined',)

    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal info', {'fields': ('phone_number', 'email')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2'),
        }),
    )

    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        if request.user.is_superuser:
            return queryset
        return queryset.filter(id=request.user.id)
