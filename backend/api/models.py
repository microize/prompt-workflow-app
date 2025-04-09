from django.db import models
from django.utils import timezone

class Prompt(models.Model):
    text = models.TextField()
    title = models.CharField(max_length=255, blank=True, null=True)
    category = models.CharField(max_length=100, blank=True, null=True)
    usage_count = models.IntegerField(default=0)
    tags = models.CharField(max_length=255, blank=True, null=True)
    favorite = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_used = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return self.title or self.text[:50]
    
    def increment_usage(self):
        self.usage_count += 1
        self.last_used = timezone.now()
        self.save()

class Workflow(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    category = models.CharField(max_length=100, blank=True, null=True)
    data = models.JSONField()
    usage_count = models.IntegerField(default=0)
    favorite = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_used = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return self.name
    
    def increment_usage(self):
        self.usage_count += 1
        self.last_used = timezone.now()
        self.save()