# Generated by Django 3.0.3 on 2020-03-27 04:05

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('ass_man', '0014_permission'),
    ]

    operations = [
        migrations.AlterField(
            model_name='permission',
            name='datacenter',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='ass_man.Datacenter'),
        ),
    ]
