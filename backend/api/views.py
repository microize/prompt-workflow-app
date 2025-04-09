from django.utils import timezone
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Prompt, Workflow
from .serializers import PromptSerializer, WorkflowSerializer

class PromptViewSet(viewsets.ModelViewSet):
    queryset = Prompt.objects.all().order_by('-updated_at')
    serializer_class = PromptSerializer
    
    @action(detail=True, methods=['post'])
    def toggle_favorite(self, request, pk=None):
        prompt = self.get_object()
        prompt.favorite = not prompt.favorite
        prompt.save()
        serializer = self.get_serializer(prompt)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def increment_usage(self, request, pk=None):
        prompt = self.get_object()
        prompt.increment_usage()
        serializer = self.get_serializer(prompt)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def favorites(self, request):
        favorites = Prompt.objects.filter(favorite=True).order_by('-updated_at')
        serializer = self.get_serializer(favorites, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def recent(self, request):
        recent = Prompt.objects.exclude(last_used=None).order_by('-last_used')[:10]
        serializer = self.get_serializer(recent, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def popular(self, request):
        popular = Prompt.objects.filter(usage_count__gt=0).order_by('-usage_count')[:10]
        serializer = self.get_serializer(popular, many=True)
        return Response(serializer.data)

class WorkflowViewSet(viewsets.ModelViewSet):
    queryset = Workflow.objects.all().order_by('-updated_at')
    serializer_class = WorkflowSerializer
    
    @action(detail=True, methods=['post'])
    def toggle_favorite(self, request, pk=None):
        workflow = self.get_object()
        workflow.favorite = not workflow.favorite
        workflow.save()
        serializer = self.get_serializer(workflow)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def increment_usage(self, request, pk=None):
        workflow = self.get_object()
        workflow.increment_usage()
        serializer = self.get_serializer(workflow)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def favorites(self, request):
        favorites = Workflow.objects.filter(favorite=True).order_by('-updated_at')
        serializer = self.get_serializer(favorites, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def recent(self, request):
        recent = Workflow.objects.exclude(last_used=None).order_by('-last_used')[:10]
        serializer = self.get_serializer(recent, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def popular(self, request):
        popular = Workflow.objects.filter(usage_count__gt=0).order_by('-usage_count')[:10]
        serializer = self.get_serializer(popular, many=True)
        return Response(serializer.data)