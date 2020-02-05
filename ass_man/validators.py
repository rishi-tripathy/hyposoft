# DEPRECATED: This file no longer in use- only used by database migrations

from django.core.exceptions import ValidationError
import re


# TODO: figure out a way to put an instance in the right place in a rack

# Code below this point is NOT IN USE and is DEPRECATED. Only here because the db migrations used to think it was
def validate_color(value):
    return
    # deprecated


# adapted from https://stackoverflow.com/questions/2063213/regular-expression-for-validating-dns-label-host-name
def validate_hostname(value):
    return
    # deprecated

def validate_rack_number(value):
    return
    #deprecated

