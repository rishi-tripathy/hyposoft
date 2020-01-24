from django.core.exceptions import ValidationError
import re


def validate_color(value):
    if not re.match("^[A-Fa-f0-9]*$", value):
        print(type(value))
        raise ValidationError(
            '%(value)s is not an valid color. Please ensure this value is a RGB specifier between 000000-FFFFFF',
            params={'value': value},
        )