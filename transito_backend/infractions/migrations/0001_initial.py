# Generated by Django 5.0.1 on 2024-01-20 16:20

import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Brand',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid1, primary_key=True, serialize=False, unique=True)),
                ('name', models.CharField(max_length=50)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Infraction',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid1, primary_key=True, serialize=False, unique=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('comments', models.TextField()),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Officer',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid1, primary_key=True, serialize=False, unique=True)),
                ('name', models.CharField(max_length=50)),
                ('identification', models.CharField(max_length=10)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Person',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid1, primary_key=True, serialize=False, unique=True)),
                ('name', models.CharField(max_length=50)),
                ('email', models.EmailField(max_length=20)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Vehicle',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid1, primary_key=True, serialize=False, unique=True)),
                ('license_plate', models.CharField(max_length=6)),
                ('color', models.CharField(max_length=50)),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
