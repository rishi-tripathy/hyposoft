# Generated by Django 3.0.3 on 2020-03-27 19:35

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('ass_man', '0015_auto_20200327_0405'),
    ]

    operations = [
        migrations.AddField(
            model_name='permission',
            name='asset',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='ass_man.Asset'),
        ),
    ]