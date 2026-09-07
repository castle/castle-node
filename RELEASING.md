# Releasing

1. Create branch `release/X.Y.Z` from `main`.
2. Update `version` in `package.json` to the new version
3. Run `npm install` (to refresh `package-lock.json`)
4. Update the `CHANGELOG.md` for the impending release
5. `git commit -am "release X.Y.Z"` (where X.Y.Z is the new version)
6. Push to Github, make PR to the `main` branch, and when approved, merge.
7. Make a release on Github from the `main` branch, specify tag as `vX.Y.Z` to create a tag.
8. `git checkout main && git pull`
9. Clean unversioned files: `git clean -fdx dist`
10. `npm run build && npm pack` to verify the package
11. `npm publish`
