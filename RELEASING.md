# Releasing

1. Create branch `release/X.Y.Z` from `develop`.
2. Update `version` in `package.json` to the new version
3. Run `npm install` (to refresh `package-lock.json`)
4. Update the `CHANGELOG.md` for the impending release
5. `git commit -am "release X.Y.Z"` (where X.Y.Z is the new version)
6. Push to Github, make PR to the `develop` branch, and when approved, merge.
7. Pull latest `develop`, merge it into `master`, and push `master` to `origin`.
8. Make a release on Github from the `master` branch, specify tag as `vX.Y.Z` to create a tag.
9. `git checkout master && git pull`
10. Clean unversioned files: `git clean -fdx dist`
11. `npm run build && npm pack` to verify the package
12. `npm publish`
