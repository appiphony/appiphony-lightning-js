1. Update `home.hbs` to reflect the new version number
2. Update `README.md` to reflect the new version number
3. Update `package.json` to reflect the new version number
4. Update `bower.json` to reflect the new version number
5. Update `gulpfile.js` to reflect the new version number and copyright year
6. Update `changelog.hbs`
7. Update `CHANGELOG.md`
8. Retrieve latest version of Moment from NPM (reinstall)
9. Merge pull requests into `development` branch
10. Run Gulp to build public site and distribution files
11. Checkout `master` branch
12. Merge `development` branch into `master` branch
13. Tag release on GitHub with version number
14. Close GitHub issues
15. Publish package on NPM
16. Deploy public site to host
17. Checkout `development` branch for continued development