# postmanDocs
Create the project documentation from a postman collection

## Structure
The project has 3 subprojects:
- API: for the frontend mainly. You can do everything without CMS. Is web token auth based.
- CMS: for create projects and manage users (user crud, permissions and roles)
- FrontEnd: to show the projects documentations. Is a separate project: https://github.com/oleurud/postmanDocsFront

## Install
- Clone the project
- npm install
- cp parameters.json.dist parameters.json
- Configure the parameters in parameters.json (especially the secret parameter)

## Fixtures
- (optional but recommended) edit the file fixtures.js and set a new password for admin user
- npm run fixtures

## Run
- npm run start-dev

You can run the API, the CMS or both changing the parameters.json file, setting the parameter "active" with true or false

## Create a new project documentation
- Enter in the CMS as SuperAdmin user (the fixtures creates ones)
- Add new
- Creates users and set permissions

## User types
- Client: show projects in the frontend
- Admin: create projects and set users permissions to show this projects
- SuperAdmin: everything
