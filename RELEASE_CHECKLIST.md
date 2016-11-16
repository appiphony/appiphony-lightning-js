1. Update `home.hbs` to reflect new version numbers
2. Update `README.md` to reflect new version numbers
3. Update `package.json` to reflect new version numbers
4. Update `changelog.hbs`
5. Update `CHANGELOG.md`

#### Without Pull Requests
6. Retrieve latest version of Moment from NPM (reinstall)
7. Run Gulp to build public site and distribution files
8. Merge `development` branch into `master` branch and delete `development` branch
9. Checkout `master` branch
10. Tag release on GitHub with version number
11. Publish package on NPM with version number
12. Create and checkout new `development` branch

#### With Pull Requests
6. Merge `development` branch into `master` branch and delete `development` branch
7. Checkout `master` branch
8. Merge pull requests into `master` branch
9. Retrieve latest version of Moment from NPM (reinstall)
10. Run Gulp to build public site and distribution files
11. Tag release on GitHub with version number
12. Publish package on NPM with version number
13. Create and checkout new `development` branch