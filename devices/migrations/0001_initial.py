# Generated by Django 4.0.5 on 2022-07-21 11:29

from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
import model_utils.fields


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Category',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date_created', model_utils.fields.AutoCreatedField(default=django.utils.timezone.now, editable=False, verbose_name='date created')),
                ('date_updated', model_utils.fields.AutoLastModifiedField(default=django.utils.timezone.now, editable=False, verbose_name='date updated')),
                ('name', models.CharField(max_length=120)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Device',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date_created', model_utils.fields.AutoCreatedField(default=django.utils.timezone.now, editable=False, verbose_name='date created')),
                ('date_updated', model_utils.fields.AutoLastModifiedField(default=django.utils.timezone.now, editable=False, verbose_name='date updated')),
                ('title', models.CharField(max_length=120)),
                ('description', models.TextField()),
                ('type', models.CharField(choices=[('GAS', 'Gas'), ('PROXIMITY', 'Proximity'), ('TOUCH', 'Touch')], max_length=10, verbose_name='Device Type')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='DeviceReading',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date_created', model_utils.fields.AutoCreatedField(default=django.utils.timezone.now, editable=False, verbose_name='date created')),
                ('date_updated', model_utils.fields.AutoLastModifiedField(default=django.utils.timezone.now, editable=False, verbose_name='date updated')),
                ('device', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='device', to='devices.device')),
            ],
            options={
                'abstract': False,
                'base_manager_name': 'objects',
            },
        ),
        migrations.CreateModel(
            name='DigitalCameraReading',
            fields=[
                ('devicereading_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='devices.devicereading')),
            ],
            options={
                'abstract': False,
                'base_manager_name': 'objects',
            },
            bases=('devices.devicereading',),
        ),
        migrations.CreateModel(
            name='GasSensorReading',
            fields=[
                ('devicereading_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='devices.devicereading')),
            ],
            options={
                'abstract': False,
                'base_manager_name': 'objects',
            },
            bases=('devices.devicereading',),
        ),
        migrations.CreateModel(
            name='ProximitySensorReading',
            fields=[
                ('devicereading_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='devices.devicereading')),
            ],
            options={
                'abstract': False,
                'base_manager_name': 'objects',
            },
            bases=('devices.devicereading',),
        ),
        migrations.CreateModel(
            name='TouchSensorReading',
            fields=[
                ('devicereading_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='devices.devicereading')),
            ],
            options={
                'abstract': False,
                'base_manager_name': 'objects',
            },
            bases=('devices.devicereading',),
        ),
    ]
