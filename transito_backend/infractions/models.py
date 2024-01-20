from django.db import models
from utilities.models import AbstractModel, CustomUser
from django.contrib.auth.hashers import make_password


class Person(AbstractModel):
    name = models.CharField(max_length=50)
    email = models.EmailField(max_length=20)


class Brand(AbstractModel):
    name = models.CharField(max_length=50)


class Vehicle(AbstractModel):
    brand = models.ForeignKey(Brand, on_delete=models.PROTECT)
    license_plate = models.CharField(max_length=6)
    color = models.CharField(max_length=50)
    infractor = models.ForeignKey(Person, on_delete=models.PROTECT)


class Officer(AbstractModel):
    name = models.CharField(max_length=50)
    identification = models.CharField(max_length=10)
    credentials = models.OneToOneField(CustomUser, related_name="officer_user", on_delete=models.CASCADE)

    def save(self, *args, **kwargs):
        officer_user = CustomUser(
            username=self.name,
            password=make_password(self.identification),
            is_staff=False,
            is_superuser=False,
        )
        officer_user.save()
        self.credentials = officer_user
        super().save(*args, **kwargs)


class Infraction(AbstractModel):
    officer = models.ForeignKey(Officer, on_delete=models.PROTECT)
    created_at = models.DateTimeField(auto_now_add=True)
    vehicle = models.ForeignKey(Vehicle, on_delete=models.PROTECT)
    comments = models.TextField(null=True, blank=True)
