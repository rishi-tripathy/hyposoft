from django.core.exceptions import ValidationError


def validate_color(value):
    if not value.isNumeric():
        raise ValidationError(
            '%(value)s is not an valid Color. Please ensure this value is a RGB specifier between 000000-FFFFFF',
            params={'value': value},
        )