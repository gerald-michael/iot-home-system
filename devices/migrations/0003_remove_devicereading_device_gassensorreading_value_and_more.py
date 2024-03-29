# Generated by Django 4.0.5 on 2022-08-10 08:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('devices', '0002_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='devicereading',
            name='device',
        ),
        migrations.AddField(
            model_name='gassensorreading',
            name='value',
            field=models.IntegerField(default=1),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='proximitysensorreading',
            name='distance',
            field=models.IntegerField(default=1),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='proximitysensorreading',
            name='image',
            field=models.ImageField(default=1, upload_to=''),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='touchsensorreading',
            name='image',
            field=models.ImageField(default=1, upload_to=''),
            preserve_default=False,
        ),
        migrations.DeleteModel(
            name='DigitalCameraReading',
        ),
    ]
