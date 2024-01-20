from django.db import models
from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid


class AbstractModel(models.Model):
    id = models.UUIDField(default=uuid.uuid1, unique=True, primary_key=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True
        ordering = ["-created_at", "-updated_at"]


class CustomUser(AbstractUser):
    identification = models.CharField(
        max_length=50, null=True, blank=True)

    class Meta:
        verbose_name = "Extended User"
        ordering = ['-id']

    def get_full_name(self):
        return f"{self.username}: {self.first_name} {self.last_name}"

    def __str__(self):
        return self.get_full_name()
