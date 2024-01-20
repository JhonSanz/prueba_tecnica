from django.db import models
from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid


class AbstractModel(models.Model):
    id = models.UUIDField(default=uuid.uuid1, unique=True, primary_key=True)

    class Meta:
        abstract = True


class CustomUser(AbstractUser):
    class Meta:
        verbose_name = "Custom user"
        ordering = ['-id']

    def get_full_name(self):
        return f"{self.username}: {self.first_name} {self.last_name}"

    def __str__(self):
        return self.get_full_name()
