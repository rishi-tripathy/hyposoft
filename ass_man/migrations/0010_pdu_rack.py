# Generated by Django 3.0.2 on 2020-02-21 17:07

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('ass_man', '0009_model_network_ports_num'),
    ]

    operations = [
        migrations.AddField(
            model_name='pdu',
            name='rack',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='ass_man.Rack'),
        ),
    ]
