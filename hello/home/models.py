from django.db import models

# Create your models here.
class Signup(models.Model):
    name = models.CharField( max_length=100)
    email= models.CharField( max_length=100, unique= True)
    password= models.CharField( max_length=122)
    date= models.DateField(  auto_now_add=True)

# models.py
from django.db import models

class Signup(models.Model):
    name = models.CharField(max_length=100)
    email = models.CharField(max_length=100, unique=True)
    password = models.CharField(max_length=122)
    date = models.DateField(auto_now_add=True)

    # def __str__(self):
    #     return self.name  #sefl.email if u want to see email
  
    def __str__(self):
     return f"{self.name} ({self.email})"



class Event(models.Model):
    PRIVACY_CHOICES = [
        ('public', 'Public with Code'),
        ('private', 'Invitation Only'),
    ]

    THEME_CHOICES = [
        ('emerald', 'Emerald'),
        ('gold', 'Gold'),
        ('purple', 'Purple'),
        ('blue', 'Blue'),
        ('coral', 'Coral'),
    ]

    event_name = models.CharField(max_length=255)
    event_date = models.DateField()
    event_time = models.TimeField(blank=True, null=True)
    location = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)
    privacy = models.CharField(max_length=10, choices=PRIVACY_CHOICES, default='public')
    allow_upload = models.BooleanField(default=True)
    allow_download = models.BooleanField(default=True)
    allow_tag = models.BooleanField(default=False)
    allow_comment = models.BooleanField(default=False)
    cover_photo = models.ImageField(upload_to='event_covers/', blank=True, null=True)
    theme_color = models.CharField(max_length=20, choices=THEME_CHOICES, default='emerald')
    event_code = models.CharField(max_length=20, unique=True)
    
    # 👇 ForeignKey to Signup
    created_by = models.ForeignKey(Signup, on_delete=models.CASCADE, related_name='events')

    def __str__(self):
        return self.event_name

   