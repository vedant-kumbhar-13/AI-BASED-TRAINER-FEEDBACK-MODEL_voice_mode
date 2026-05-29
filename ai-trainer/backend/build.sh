#!/usr/bin/env bash
set -o errexit

echo "=== Step 1: Installing requirements ==="
pip install -r requirements.txt

echo "=== Step 2: Collecting static files ==="
python manage.py collectstatic --noinput || echo "WARNING: collectstatic failed but continuing..."

echo "=== Step 3: Running migrations ==="
python manage.py migrate

echo "=== Step 4: Seeding aptitude data ==="
python manage.py seed_aptitude 2>&1 || echo "WARNING: seed_aptitude failed but continuing..."


echo "=== Step 5: Syncing aptitude topics to learning page ==="
python -c "
import os, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ai_trainer.settings')
django.setup()
from apps.aptitude.models import AptitudeTopic
from apps.learning.models import Topic
from django.utils.text import slugify

synced = 0
apt_names = set()
for apt in AptitudeTopic.objects.all():
    has_questions = apt.questions.count() > 0
    slug = slugify(apt.name)
    apt_names.add(apt.name)
    defaults = {
        'name': apt.name,
        'category': apt.category if apt.category in dict(Topic.CATEGORY_CHOICES) else 'quantitative',
        'icon': apt.icon or '📘',
        'level': apt.level or 'Beginner',
        'definition': apt.definition or '',
        'has_quiz': has_questions,
        'is_archived': False,
        'order': apt.order,
    }
    topic, created = Topic.objects.update_or_create(slug=slug, defaults=defaults)
    synced += 1

# Archive stale learning topics that have no matching AptitudeTopic
archived = Topic.objects.exclude(name__in=apt_names).update(is_archived=True, has_quiz=False)
print(f'Synced {synced} aptitude topics. Archived {archived} stale topics.')
" 2>&1 || echo "WARNING: sync step failed but continuing..."

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
