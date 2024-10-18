# Changelog

## [1.16.2](https://github.com/SethCohen/github-releases-to-discord/compare/v1.16.1...v1.16.2) (2024-10-18)


### Documentation

* update README output example ([6aa0dd9](https://github.com/SethCohen/github-releases-to-discord/commit/6aa0dd988c547f3b3a73463bc6e69d944621c613))

## [1.16.1](https://github.com/SethCohen/github-releases-to-discord/compare/v1.16.0...v1.16.1) (2024-10-18)


### Bug Fixes

* correct conversion of standalone PR, issue, and changelog URLs to markdown format ([4786949](https://github.com/SethCohen/github-releases-to-discord/commit/47869497ed80cf0d6188692d82d71dff7a55dffe)), closes [#38](https://github.com/SethCohen/github-releases-to-discord/issues/38)


### Documentation

* update README with details on markdown link conversion and other features ([9737dc9](https://github.com/SethCohen/github-releases-to-discord/commit/9737dc900274be227db48f8e23c715aa00b4af59))

## [1.16.0](https://github.com/SethCohen/github-releases-to-discord/compare/v1.15.3...v1.16.0) (2024-10-18)


### Features

* add function to convert PR, issue, and changelog links to markdown format ([07c2e1c](https://github.com/SethCohen/github-releases-to-discord/commit/07c2e1c3e60591d601b5d4b5bd4fc90e599867f8)), closes [#32](https://github.com/SethCohen/github-releases-to-discord/issues/32)

## [1.15.3](https://github.com/SethCohen/github-releases-to-discord/compare/v1.15.2...v1.15.3) (2024-10-18)


### Documentation

* add contribution guidelines to README.md ([5fd64bf](https://github.com/SethCohen/github-releases-to-discord/commit/5fd64bf266cea87ab4952ef9a4c6aaf099f266bc))
* update version reference in README.md ([93d02ce](https://github.com/SethCohen/github-releases-to-discord/commit/93d02ce8714c5f3e201f5b379422e978b837774b))


### Miscellaneous

* update .gitignore ([3449e38](https://github.com/SethCohen/github-releases-to-discord/commit/3449e38629b0c40dde5af524e2fef220dab24ead))
* update package-lock.json ([5dc4108](https://github.com/SethCohen/github-releases-to-discord/commit/5dc41089e63d18b5b191533c34cdddeab34a07e8))

## [1.15.2](https://github.com/SethCohen/github-releases-to-discord/compare/v1.15.1...v1.15.2) (2024-10-18)


### Bug Fixes

* improve [@mention](https://github.com/mention) parsing for GitHub usernames ([#33](https://github.com/SethCohen/github-releases-to-discord/issues/33)) ([925765f](https://github.com/SethCohen/github-releases-to-discord/commit/925765f099dcdc3b12316eaa6dc3c17506734b51))

## [1.15.1](https://github.com/SethCohen/github-releases-to-discord/compare/v1.15.0...v1.15.1) (2024-10-04)


### Documentation

* updated README.md ([613ba26](https://github.com/SethCohen/github-releases-to-discord/commit/613ba269d7fe40e97040da19de58b0ae00b47aaf))


### Miscellaneous

* added test envs to .gitignore ([735cca9](https://github.com/SethCohen/github-releases-to-discord/commit/735cca9de37b345e69b0c74ff761610eab6f1fd1))
* updated test action ([305fe92](https://github.com/SethCohen/github-releases-to-discord/commit/305fe9299dddb3a514f2b1692773570862c34d46))


### Code Refactoring

* code cleanup ([5ca1453](https://github.com/SethCohen/github-releases-to-discord/commit/5ca1453a69f962930450a9f77d4e20cc37e4110f))

## [1.15.0](https://github.com/SethCohen/github-releases-to-discord/compare/v1.14.0...v1.15.0) (2023-12-14)


### Features

* added clip description at last newline ([#25](https://github.com/SethCohen/github-releases-to-discord/issues/25)) ([97a4813](https://github.com/SethCohen/github-releases-to-discord/commit/97a481333d0b902f599b12f03b47c4a6cbfa5e52))

## [1.14.0](https://github.com/SethCohen/github-releases-to-discord/compare/v1.13.1...v1.14.0) (2023-12-11)


### Features

* added additional description formatting ([#23](https://github.com/SethCohen/github-releases-to-discord/issues/23)) ([8ca9da2](https://github.com/SethCohen/github-releases-to-discord/commit/8ca9da2ca8e3435ee9b0d387355c0fae255c16b0))
* added max_description option ([8ca9da2](https://github.com/SethCohen/github-releases-to-discord/commit/8ca9da2ca8e3435ee9b0d387355c0fae255c16b0))
* added reduce_headings option ([8ca9da2](https://github.com/SethCohen/github-releases-to-discord/commit/8ca9da2ca8e3435ee9b0d387355c0fae255c16b0))
* description trimming ([8ca9da2](https://github.com/SethCohen/github-releases-to-discord/commit/8ca9da2ca8e3435ee9b0d387355c0fae255c16b0))


### Styles

* parse common Github URLs to more appropriate display ([8ca9da2](https://github.com/SethCohen/github-releases-to-discord/commit/8ca9da2ca8e3435ee9b0d387355c0fae255c16b0))
* reduce consecutive whitespace/newlines into a minimum of 2 to allow separation in paragraphs ([8ca9da2](https://github.com/SethCohen/github-releases-to-discord/commit/8ca9da2ca8e3435ee9b0d387355c0fae255c16b0))


### Miscellaneous

* update README.md ([254bf79](https://github.com/SethCohen/github-releases-to-discord/commit/254bf7919618aea9ce0a3db67901010a20426def))

## [1.13.1](https://github.com/SethCohen/github-releases-to-discord/compare/v1.13.0...v1.13.1) (2023-09-23)


### Miscellaneous

* updated action info ([c240910](https://github.com/SethCohen/github-releases-to-discord/commit/c240910f8922fb8492346613f67a84811a0fdbac))
* updated action info ([c888953](https://github.com/SethCohen/github-releases-to-discord/commit/c8889535c4a02efec3e8a6b26e1ee17fcd36ac7b))
* updated dependencies ([24b80ab](https://github.com/SethCohen/github-releases-to-discord/commit/24b80abb6f9c71123456a908af5d3b92ccc755af))
* updated README.md ([ba06d83](https://github.com/SethCohen/github-releases-to-discord/commit/ba06d833522e55d3453ee27bea9a7f3655378359))
* updated README.md ([ce7fc4a](https://github.com/SethCohen/github-releases-to-discord/commit/ce7fc4a3be811af077c4f43dd005851d65204fb1))
* updated release-please action ([933f3cf](https://github.com/SethCohen/github-releases-to-discord/commit/933f3cffcf2139fcd71dddbb8bc76bc7cfa09170))

## [1.13.0](https://github.com/SethCohen/github-release-to-discord/compare/v1.12.1...v1.13.0) (2022-08-25)


### Features

* created test action ([d76d7aa](https://github.com/SethCohen/github-release-to-discord/commit/d76d7aafe49eadfc8d388bef38a8d3fb0230041b))

## [1.12.1](https://github.com/SethCohen/github-release-to-discord/compare/v1.12.0...v1.12.1) (2022-08-24)


### Miscellaneous Chores

* release 1.12.1 ([6aea64b](https://github.com/SethCohen/github-release-to-discord/commit/6aea64bf70aca011417fed5000ff080269024a93))

## [1.12.0](https://github.com/SethCohen/github-release-to-discord/compare/v1.11.1...v1.12.0) (2022-08-24)


### Features

* renamed all `colour`>`color` ([a0914f4](https://github.com/SethCohen/github-release-to-discord/commit/a0914f433a5c2a2626ca39637851235fd4f7adea))

## [1.11.1](https://github.com/SethCohen/github-release-to-discord/compare/v1.11.0...v1.11.1) (2022-08-24)


### Bug Fixes

* fixed ReferenceError on require  vs import ([233db9c](https://github.com/SethCohen/github-release-to-discord/commit/233db9c33f9059cbe008e61acf7f321e671f352c))

## [1.11.0](https://github.com/SethCohen/github-release-to-discord/compare/v1.10.1...v1.11.0) (2022-08-24)


### Features

* updated `action.yml` ([e49c674](https://github.com/SethCohen/github-release-to-discord/commit/e49c674890cd5309d63bf570a550ffa0361c9ebc))
* updated `package.json` ([aea0a60](https://github.com/SethCohen/github-release-to-discord/commit/aea0a60ccd2456ae24e6ce7f21c1622a1b3ee18f))


### Bug Fixes

* fixed version tag ([baa4c82](https://github.com/SethCohen/github-release-to-discord/commit/baa4c82901455b2fbc18187cfa8f74f2a171f033))

## [1.10.0](https://github.com/SethCohen/github-release-to-discord/compare/v1.9.0...v1.10.0) (2022-08-24)


### Features

* added dependencies and removed `.idea` ([fd59991](https://github.com/SethCohen/github-release-to-discord/commit/fd59991cc10608712b6e30a81f3cf0358c7dcf9d))

## [1.9.0](https://github.com/SethCohen/github-release-to-discord/compare/v1.8.0...v1.9.0) (2022-08-24)


### Features

* updated action description format ([6cf9efb](https://github.com/SethCohen/github-release-to-discord/commit/6cf9efb8f65526de47e335b56163eef55b6b9a1c))

## [1.8.0](https://github.com/SethCohen/github-release-to-discord/compare/v1.7.0...v1.8.0) (2022-08-24)


### Features

* updated action description format ([9c4c902](https://github.com/SethCohen/github-release-to-discord/commit/9c4c90246562bad1531cf41d44d3c037fbf869ee))

## [1.7.0](https://github.com/SethCohen/github-release-to-discord/compare/v1.6.0...v1.7.0) (2022-08-24)


### Features

* updated action description format ([c517936](https://github.com/SethCohen/github-release-to-discord/commit/c517936fefb0119c0055d4d537bad23e647edd44))

## [1.6.0](https://github.com/SethCohen/github-release-to-discord/compare/v1.5.0...v1.6.0) (2022-08-24)


### Features

* updated action description format ([7effb69](https://github.com/SethCohen/github-release-to-discord/commit/7effb69a75fd35dc53ea6dad5f3fa60cbd523ee7))

## [1.5.0](https://github.com/SethCohen/github-release-to-discord/compare/v1.4.0...v1.5.0) (2022-08-24)


### Features

* updated action description format ([9f49b0c](https://github.com/SethCohen/github-release-to-discord/commit/9f49b0c9ab5de966ccc4af94863fbddd73bac884))

## [1.4.0](https://github.com/SethCohen/github-release-to-discord/compare/v1.3.0...v1.4.0) (2022-08-24)


### Features

* updated action colour ([ac2e4a3](https://github.com/SethCohen/github-release-to-discord/commit/ac2e4a38e2cad7e65dac53a1b4591fd46d65130d))
* updated description ([4517d8d](https://github.com/SethCohen/github-release-to-discord/commit/4517d8d0ec09c575248503c50ed25f15677f8f3d))

## [1.3.0](https://github.com/SethCohen/github-release-to-discord/compare/v1.2.0...v1.3.0) (2022-08-24)


### Features

* changed default action colour ([79005b2](https://github.com/SethCohen/github-release-to-discord/commit/79005b23fefce850957d37ba17ebb796dc81f6a1))
* updated description format ([a1d7a74](https://github.com/SethCohen/github-release-to-discord/commit/a1d7a74af90fcf8c00d341c8c665ca796b18c689))

## [1.2.0](https://github.com/SethCohen/github-release-to-discord/compare/v1.1.0...v1.2.0) (2022-08-24)


### Features

* updated action ([b612527](https://github.com/SethCohen/github-release-to-discord/commit/b6125273330075a9f4de3e58f2fc7f52d85d4691))

## [1.1.0](https://github.com/SethCohen/github-release-to-discord/compare/v1.0.0...v1.1.0) (2022-08-24)


### Features

* updated release-please ([0cea8a4](https://github.com/SethCohen/github-release-to-discord/commit/0cea8a493d5e12b1dc7414ecbed678f4671dda37))

## 1.0.0 (2022-08-24)


### Features

* added action ([1c119cd](https://github.com/SethCohen/github-release-to-discord/commit/1c119cd58075c88793119ece6edfed7b02d46ef7))
* added release-please ([ad3716d](https://github.com/SethCohen/github-release-to-discord/commit/ad3716d4380d5008666794374928b6a73734a371))
* updated action ([1493174](https://github.com/SethCohen/github-release-to-discord/commit/1493174a77435e53b6a8aea6afb4db0cbbf96d9f))
