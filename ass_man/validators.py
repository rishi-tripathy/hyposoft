from django.core.exceptions import ValidationError
import re


def validate_color(value):
    if not re.match('^[A-Fa-f0-9]*$', value):
        raise ValidationError(
            '%(value)s is not an valid color. Please ensure this value is a RGB specifier between 000000-FFFFFF',
            params={'value': value},
        )


def validate_hostname(value):
    if not re.match('^(?![0-9]+$)(?!-)[a-zA-Z0-9-]{,63}(?<!-)$', value):  # adapted from
        raise ValidationError(
            '%(value)s is not an valid hostname. Please ensure this value is a valid hostname as per RFC 1034.',
            params={'value': value},
        )

