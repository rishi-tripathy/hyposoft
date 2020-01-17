# Run this from the hyposoft directory.
# It installs all requirements inside a virtual env,
# migrates changes made to the database schema,
# starts and runs the testsuite, and launches the app locally


# Migrating db changes
printf "\e[42mInstalling Dependencies...\e[0m\n\n"
pipenv install
npm install

printf "\n\n\e[42mMigrating changes...\e[0m\n\n"
python manage.py makemigrations
python manage.py migrate

# Running tests
printf "\n\n\e[42mRunning test suite...\e[0m\n\n"
python manage.py test

# Launching app
printf "\n\n\e[42mRunning app locally...\e[0m\n\n"
heroku local

