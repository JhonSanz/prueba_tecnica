from django.db import models


class Person(models.Model):
    name = models.CharField(max_length=50)
    email = models.EmailField(max_length=20)


class Brand(models.Model):
    name = models.CharField(max_length=50)


class Vehicle(models.Model):
    brand = models.ForeignKey(Brand, on_delete=models.PROTECT)
    license_plate = models.CharField(max_length=6)
    color = models.CharField(max_length=50)
    infractor = models.ForeignKey(Person, on_delete=models.PROTECT)


class Officer(models.Model):
    name = models.CharField(max_length=50)
    identification = models.CharField(max_length=10)


class Infraction(models.Model):
    officer = models.ForeignKey(Officer, on_delete=models.PROTECT)
    created_at = models.DateTimeField(auto_now_add=True)
    vehicle = models.ForeignKey(Vehicle, on_delete=models.PROTECT)
    comments = models.TextField()
