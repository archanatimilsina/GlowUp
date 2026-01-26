### how to setup backend 

```
# Create the environment
python3 -m venv .venv
source .venv/bin/activate   #(in mac)
pip3 install -r requirements.txt

```

ADMIN pANel password
admin : username
admin@gmail.com : email
admin : Password


another account
glowupUser : username
/: email
glowup12345 : Password


# create superuser
python3 manage.py createsuperuser

# run server
python3 manage.py runserver

# create python venv
python3 -m venv .GlowUpArea

# install requirement.txt
pip install -r requirements.txt

# run venv
source .GlowUpArea/bin/activate

# install djangorestframework
pip3 install djangorestframework

# install django
pip3 install Django
django-admin --version

# start project
django-admin startproject glowup .

# start app
python3 manage.py startapp appName

# make migrations
python3 manage.py makemigrations

# migrate
python3 manage.py migrate

