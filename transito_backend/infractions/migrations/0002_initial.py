# Generated by Django 5.0.1 on 2024-01-20 16:20

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('infractions', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='officer',
            name='credentials',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='officer_user', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='infraction',
            name='officer',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='infractions.officer'),
        ),
        migrations.AddField(
            model_name='vehicle',
            name='brand',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='infractions.brand'),
        ),
        migrations.AddField(
            model_name='vehicle',
            name='infractor',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='infractions.person'),
        ),
        migrations.AddField(
            model_name='infraction',
            name='vehicle',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='infractions.vehicle'),
        ),
    ]