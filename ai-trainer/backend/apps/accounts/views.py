from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import RegisterSerializer, LoginSerializer, UserSerializer
from .models import CustomUser

class RegisterView(APIView):
    """User registration endpoint"""
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        
        if serializer.is_valid():
            user = serializer.save()
            
            refresh = RefreshToken.for_user(user)
            return Response({
                'message': 'User registered successfully',
                'user': UserSerializer(user).data,
                'refresh': str(refresh),
                'access': str(refresh.access_token)
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    """User login endpoint"""
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        
        if serializer.is_valid():
            user = serializer.validated_data['user']
            
            refresh = RefreshToken.for_user(user)
            return Response({
                'message': 'Login successful',
                'user': UserSerializer(user).data,
                'refresh': str(refresh),
                'access': str(refresh.access_token)
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    """User logout endpoint"""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        return Response({
            'message': 'Logged out successfully'
        }, status=status.HTTP_200_OK)


class ProfileView(APIView):
    """Get current user profile"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request):
        serializer = UserSerializer(
            request.user,
            data=request.data,
            partial=True
        )
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ── Dummy OTP Forgot-Password Flow ──────────────────────────────
# The hardcoded OTP is "123456". Replace with real email/SMS later.

DUMMY_OTP = "123456"


class ForgotPasswordView(APIView):
    """Step 1 – Accept email and pretend to send an OTP."""
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email', '').strip()
        if not email:
            return Response({'error': 'Email is required.'},
                            status=status.HTTP_400_BAD_REQUEST)

        if not CustomUser.objects.filter(email=email).exists():
            return Response({'error': 'No account found with this email.'},
                            status=status.HTTP_404_NOT_FOUND)

        # In production, generate a real OTP and send via email here.
        return Response({
            'message': 'OTP has been sent to your email address.',
        }, status=status.HTTP_200_OK)


class VerifyOTPView(APIView):
    """Step 2 – Verify the dummy OTP."""
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email', '').strip()
        otp = request.data.get('otp', '').strip()

        if not email or not otp:
            return Response({'error': 'Email and OTP are required.'},
                            status=status.HTTP_400_BAD_REQUEST)

        if otp != DUMMY_OTP:
            return Response({'error': 'Invalid OTP. Please try again.'},
                            status=status.HTTP_400_BAD_REQUEST)

        return Response({
            'message': 'OTP verified successfully.',
        }, status=status.HTTP_200_OK)


class ResetPasswordView(APIView):
    """Step 3 – Reset the password (re-verifies OTP for safety)."""
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email', '').strip()
        otp = request.data.get('otp', '').strip()
        new_password = request.data.get('new_password', '')

        if not email or not otp or not new_password:
            return Response({'error': 'Email, OTP, and new password are required.'},
                            status=status.HTTP_400_BAD_REQUEST)

        if otp != DUMMY_OTP:
            return Response({'error': 'Invalid OTP.'},
                            status=status.HTTP_400_BAD_REQUEST)

        if len(new_password) < 6:
            return Response({'error': 'Password must be at least 6 characters.'},
                            status=status.HTTP_400_BAD_REQUEST)

        try:
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            return Response({'error': 'No account found with this email.'},
                            status=status.HTTP_404_NOT_FOUND)

        user.set_password(new_password)
        user.save()

        return Response({
            'message': 'Password reset successfully. You can now login.',
        }, status=status.HTTP_200_OK)
