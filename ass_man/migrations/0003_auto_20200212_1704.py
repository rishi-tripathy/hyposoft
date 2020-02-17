# Generated by Django 3.0.2 on 2020-02-12 17:04

from django.conf import settings
import django.contrib.postgres.fields
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('ass_man', '0002_auto_20200201_0453'),
    ]

    operations = [
        migrations.CreateModel(
            name='Asset',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('hostname', models.CharField(blank=True, max_length=64, null=True)),
                ('rack_u', models.PositiveIntegerField()),
                ('comment', models.TextField(blank=True)),
                ('asset_number', models.PositiveIntegerField(blank=True, default=100000)),
            ],
        ),
        migrations.CreateModel(
            name='Datacenter',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('abbreviation', models.CharField(max_length=6)),
                ('name', models.CharField(max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='PDU',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
            ],
        ),
        migrations.RemoveField(
            model_name='model',
            name='network_ports',
        ),
        migrations.AddField(
            model_name='model',
            name='network_ports',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.CharField(default='e1', max_length=10), null=True, size=None),
        ),
        migrations.CreateModel(
            name='Power_Port',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('port_number', models.PositiveIntegerField()),
                ('asset', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='ass_man.Asset')),
                ('pdu', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='ass_man.PDU')),
            ],
        ),
        migrations.CreateModel(
            name='Network_Port',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(blank=True, default='mgmt', max_length=15)),
                ('mac', models.CharField(blank=True, max_length=17, null=True)),
                ('asset', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='ass_man.Asset')),
                ('connection', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='ass_man.Network_Port')),
            ],
        ),
        migrations.AddField(
            model_name='asset',
            name='datacenter',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='ass_man.Datacenter'),
        ),
        migrations.AddField(
            model_name='asset',
            name='model',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='ass_man.Model'),
        ),
        migrations.AddField(
            model_name='asset',
            name='owner',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='asset',
            name='rack',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='ass_man.Rack'),
        ),
        migrations.AddField(
            model_name='rack',
            name='datacenter',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='ass_man.Datacenter'),
        ),
        migrations.AddField(
            model_name='rack',
            name='pdu_l',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='pdu_l', to='ass_man.PDU'),
        ),
        migrations.AddField(
            model_name='rack',
            name='pdu_r',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='pdu_r', to='ass_man.PDU'),
        ),
        migrations.AlterField(
            model_name='rack',
            name='u1',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='Asset1', to='ass_man.Asset'),
        ),
        migrations.AlterField(
            model_name='rack',
            name='u10',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='Asset10', to='ass_man.Asset'),
        ),
        migrations.AlterField(
            model_name='rack',
            name='u11',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='Asset11', to='ass_man.Asset'),
        ),
        migrations.AlterField(
            model_name='rack',
            name='u12',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='Asset12', to='ass_man.Asset'),
        ),
        migrations.AlterField(
            model_name='rack',
            name='u13',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='Asset13', to='ass_man.Asset'),
        ),
        migrations.AlterField(
            model_name='rack',
            name='u14',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='Asset14', to='ass_man.Asset'),
        ),
        migrations.AlterField(
            model_name='rack',
            name='u15',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='Asset15', to='ass_man.Asset'),
        ),
        migrations.AlterField(
            model_name='rack',
            name='u16',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='Asset16', to='ass_man.Asset'),
        ),
        migrations.AlterField(
            model_name='rack',
            name='u17',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='Asset17', to='ass_man.Asset'),
        ),
        migrations.AlterField(
            model_name='rack',
            name='u18',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='Asset18', to='ass_man.Asset'),
        ),
        migrations.AlterField(
            model_name='rack',
            name='u19',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='Asset19', to='ass_man.Asset'),
        ),
        migrations.AlterField(
            model_name='rack',
            name='u2',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='Asset2', to='ass_man.Asset'),
        ),
        migrations.AlterField(
            model_name='rack',
            name='u20',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='Asset20', to='ass_man.Asset'),
        ),
        migrations.AlterField(
            model_name='rack',
            name='u21',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='Asset21', to='ass_man.Asset'),
        ),
        migrations.AlterField(
            model_name='rack',
            name='u22',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='Asset22', to='ass_man.Asset'),
        ),
        migrations.AlterField(
            model_name='rack',
            name='u23',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='Asset23', to='ass_man.Asset'),
        ),
        migrations.AlterField(
            model_name='rack',
            name='u24',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='Asset24', to='ass_man.Asset'),
        ),
        migrations.AlterField(
            model_name='rack',
            name='u25',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='Asset25', to='ass_man.Asset'),
        ),
        migrations.AlterField(
            model_name='rack',
            name='u26',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='Asset26', to='ass_man.Asset'),
        ),
        migrations.AlterField(
            model_name='rack',
            name='u27',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='Asset27', to='ass_man.Asset'),
        ),
        migrations.AlterField(
            model_name='rack',
            name='u28',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='Asset28', to='ass_man.Asset'),
        ),
        migrations.AlterField(
            model_name='rack',
            name='u29',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='Asset29', to='ass_man.Asset'),
        ),
        migrations.AlterField(
            model_name='rack',
            name='u3',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='Asset3', to='ass_man.Asset'),
        ),
        migrations.AlterField(
            model_name='rack',
            name='u30',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='Asset30', to='ass_man.Asset'),
        ),
        migrations.AlterField(
            model_name='rack',
            name='u31',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='Asset31', to='ass_man.Asset'),
        ),
        migrations.AlterField(
            model_name='rack',
            name='u32',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='Asset32', to='ass_man.Asset'),
        ),
        migrations.AlterField(
            model_name='rack',
            name='u33',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='Asset33', to='ass_man.Asset'),
        ),
        migrations.AlterField(
            model_name='rack',
            name='u34',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='Asset34', to='ass_man.Asset'),
        ),
        migrations.AlterField(
            model_name='rack',
            name='u35',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='Asset35', to='ass_man.Asset'),
        ),
        migrations.AlterField(
            model_name='rack',
            name='u36',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='Asset36', to='ass_man.Asset'),
        ),
        migrations.AlterField(
            model_name='rack',
            name='u37',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='Asset37', to='ass_man.Asset'),
        ),
        migrations.AlterField(
            model_name='rack',
            name='u38',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='Asset38', to='ass_man.Asset'),
        ),
        migrations.AlterField(
            model_name='rack',
            name='u39',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='Asset39', to='ass_man.Asset'),
        ),
        migrations.AlterField(
            model_name='rack',
            name='u4',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='Asset4', to='ass_man.Asset'),
        ),
        migrations.AlterField(
            model_name='rack',
            name='u40',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='Asset40', to='ass_man.Asset'),
        ),
        migrations.AlterField(
            model_name='rack',
            name='u41',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='Asset41', to='ass_man.Asset'),
        ),
        migrations.AlterField(
            model_name='rack',
            name='u42',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='Asset42', to='ass_man.Asset'),
        ),
        migrations.AlterField(
            model_name='rack',
            name='u5',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='Asset5', to='ass_man.Asset'),
        ),
        migrations.AlterField(
            model_name='rack',
            name='u6',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='Asset6', to='ass_man.Asset'),
        ),
        migrations.AlterField(
            model_name='rack',
            name='u7',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='Asset7', to='ass_man.Asset'),
        ),
        migrations.AlterField(
            model_name='rack',
            name='u8',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='Asset8', to='ass_man.Asset'),
        ),
        migrations.AlterField(
            model_name='rack',
            name='u9',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='Asset9', to='ass_man.Asset'),
        ),
        migrations.DeleteModel(
            name='Instance',
        ),
    ]
