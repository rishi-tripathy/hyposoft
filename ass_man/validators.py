# DEPRECATED: This file no longer in use- only used by database migrations

from django.core.exceptions import ValidationError
import re


def validate_color(value):
    if not re.match('^[A-Fa-f0-9]*$', value):
        raise ValidationError(
            '%(value)s is not an valid color. Please ensure this value is a RGB specifier between 000000-FFFFFF',
            params={'value': value},
        )


# adapted from https://stackoverflow.com/questions/2063213/regular-expression-for-validating-dns-label-host-name
def validate_hostname(value):
    if not re.match('^(?![0-9]+$)(?!-)[a-zA-Z0-9-]{,63}(?<!-)$', value):
        raise ValidationError(
            '%(value)s is not an valid hostname. Please ensure this value is a valid hostname as per RFC 1034.',
            params={'value': value},
        )


def validate_rack_number(value):
    if not re.match('^[A-Z][0-9]+$', value):
        raise ValidationError(
            '%(value)s is not a valid rack number. Please ensure this value is a '
            'capital letter followed by a positive number, e.g. "B12"',
            params={'value': value},
        )

