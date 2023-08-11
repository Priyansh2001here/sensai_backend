Backend service for Sens AI assignment. 
Server can be started using docker which has configuration for postgres database and backend service.

commands 
```
docker compose build
```

this will add required dependendencies and copy code files to docker.

```
docker compose up
```

this command will pull database and start the server which is accessible on http://localhost:5000/
Database configuration can be modified by altering .env.docker file.

Since it will initialize an empty database and this is an invite only platform, firstly you will manually need to add admin by creating an entry to users table. 

In docker compose conf. port 5432 for postgres is exposed. Since passwords are stored in encrypted format,  password can be generated through getEncpass.js file using command  ```node getEncpass.js ```. This will generate encrypted password for raw passwod passed to ```makePassword``` function. User then can login through email and password.


