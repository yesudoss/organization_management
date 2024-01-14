# Organization Management with Django and Reactjs
Welcome to the Organization Management application built with Django and ReactJS. 

# Getting Started
Follow these steps to set up the project locally:
## Prerequisites
- Python
- Node.js
- Git

### Clone the Repository
```
git clone https://github.com/yesudoss/organization_management.git
```
### Backend Configuration
Navigate to the backend directory:
```
cd backend
```

#### Install the requirements
Install the required Python packages:


```
pip install -r requirements.txt
```

#### Run migration
Apply database migrations to set up the initial database schema:
```
python manage.py migrate
```
#### Create super user
Create a superuser to manage the Django admin interface and update the user is_verified status to True:
```
python manage.py createsuperuser
```
#### Run the backend server
Start the Django backend server:


```
python manage.py runserver
```

### Frontend Configuration
Navigate to the frontend directory:



```
cd frontend
```

#### Install Frontend Dependencies
Install the required Node.js packages:


```
npm install
```
If it doesn't work use 
```
npm install --peer-legacy-deps
```
or 
```
npm install --force
```
#### Run Frontend Development Server
Start the ReactJS development server:

```
npm start
```






