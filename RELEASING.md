# Releasing

1. Create branch `release/X.Y.Z` from `master`.
2. Update `version` in `package.json` to the new version
3. Run `yarn`
4. Update the `CHANGELOG.md` for the impending release
5. `git commit -am "release X.Y.Z"` (where X.Y.Z is the new version)
6. Push to Github, make PR to the `master` branch, and when approved, merge.
7. Make a release on Github from the `master` branch, specify tag as `vX.Y.Z` to create a tag.
8. `git checkout master && git pull`
9. Clean unversioned files: `git clean -fdx dist src`
10. `yarn build && yarn pack` to verify the package
11. `yarn publish`
