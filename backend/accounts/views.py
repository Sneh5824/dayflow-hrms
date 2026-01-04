from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .serializers import RegisterSerializer, UserSerializer, ProfileUpdateSerializer
from .models import User
from rest_framework import generics, permissions, status

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
    
    def patch(self, request):
        serializer = ProfileUpdateSerializer(
            request.user, 
            data=request.data, 
            partial=True,
            context={'request': request}
        )
        if serializer.is_valid():
            serializer.save()
            # Return full user data after update
            return Response(UserSerializer(request.user).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def put(self, request):
        return self.patch(request)
