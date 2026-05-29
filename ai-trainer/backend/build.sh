#!/usr/bin/env bash
set -o errexit

echo "=== Step 1: Installing requirements ==="
pip install -r requirements.txt

echo "=== Step 2: Collecting static files ==="
python manage.py collectstatic --noinput || echo "WARNING: collectstatic failed but continuing..."

echo "=== Step 3: Running migrations ==="
python manage.py migrate

echo "=== Step 4: Loading aptitude data (topics + questions) ==="
python manage.py loaddata fixtures/aptitude_data.json 2>&1 || echo "WARNING: aptitude loaddata failed but continuing..."

echo "=== Step 5: Loading learning data (topics + videos + descriptions) ==="
python manage.py loaddata fixtures/learning_data.json 2>&1 || echo "WARNING: learning loaddata failed but continuing..."

echo "=== Step 6: Creating superuser (if not exists) ==="
python -c "
import os, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ai_trainer.settings')
django.setup()
from django.contrib.auth import get_user_model
User = get_user_model()
username = os.environ.get('DJANGO_SUPERUSER_USERNAME', 'admin')
email = os.environ.get('DJANGO_SUPERUSER_EMAIL', '')
password = os.environ.get('DJANGO_SUPERUSER_PASSWORD', '')
if password:
    user, created = User.objects.get_or_create(username=username, defaults={'email': email, 'is_staff': True, 'is_superuser': True})
    user.set_password(password)
    user.is_staff = True
    user.is_superuser = True
    user.email = email
    user.save()
    print(f'Superuser {username} {\"created\" if created else \"updated\"}.')
else:
    print('DJANGO_SUPERUSER_PASSWORD not set, skipping.')
"

echo "=== Build complete! ==="
