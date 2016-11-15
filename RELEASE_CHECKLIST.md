1. Update `home.hbs` to reflect new version numbers
2. Update `README.md` to reflect new version numbers
3. Update `changelog.hbs`
4. Update `CHANGELOG.md`

#### Without Pull Requests
5. Retrieve latest version of Moment from NPM (reinstall)
6. Run Gulp to build public site and distribution files
7. Merge `development` branch into `master` branch and delete `development` branch
8. Checkout `master` branch
9. Tag release on GitHub with version number
10. Publish package on NPM with version number
11. Create and checkout new `development` branch

#### With Pull Requests
5. Merge `development` branch into `master` branch and delete `development` branch
6. Checkout `master` branch
7. Merge pull requests into `master` branch
8. Retrieve latest version of Moment from NPM (reinstall)
9. Run Gulp to build public site and distribution files
10. Tag release on GitHub with version number
11. Publish package on NPM with version number
12. Create and checkout new `development` branch