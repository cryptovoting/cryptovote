# Used for deploying on Apache with mod_wsgi
from cryptovote.app import create_app
application = create_app()
