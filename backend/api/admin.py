from django.contrib import admin
from .models import Prompt, Workflow

@admin.register(Prompt)
class PromptAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'category', 'usage_count', 'favorite', 'last_used')
    list_filter = ('category', 'favorite')
    search_fields = ('title', 'text', 'tags')

@admin.register(Workflow)
class WorkflowAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'category', 'usage_count', 'favorite', 'last_used')
    list_filter = ('category', 'favorite')
    search_fields = ('name', 'description')