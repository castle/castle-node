# Changelog

## 1.0.2

**BugFix:**

- [#119](https://github.com/castle/castle-node/pull/119)
  * fixed path resolving

## 1.0.1

**Enhancements:**

- [#117](https://github.com/castle/castle-node/pull/117)
  * typings improvements

## 1.0.0
**BREAKING CHANGES:**
  - remove `identify` and `review` commands - they are no longer supported

  - renamed setUseWhitelist with setUseAllowlist

  - added better support for configuration, replaced apiUrl with baseUrl option
    * [#97](https://github.com/castle/castle-node/pull/97)

  - replace logLevel with logger in the config
    * [#97](https://github.com/castle/castle-node/pull/111)

  - dropped EVENTS const with list of events
    * [#97](https://github.com/castle/castle-node/pull/114)
**Enhancements:**
  - restructuring the codebase 
    * [#89](https://github.com/castle/castle-node/pull/89)
    * [#90](https://github.com/castle/castle-node/pull/90)
    * [#91](https://github.com/castle/castle-node/pull/91)
    * [#100](https://github.com/castle/castle-node/pull/100)
    * [#101](https://github.com/castle/castle-node/pull/101)
    * [#102](https://github.com/castle/castle-node/pull/102)
    * [#110](https://github.com/castle/castle-node/pull/110)
    * [#110](https://github.com/castle/castle-node/pull/113)

  - added failover and timeout support
    * [#93](https://github.com/castle/castle-node/pull/93)

  - added ability to set ip headers and proxies
    * [#96](https://github.com/castle/castle-node/pull/96)

  - added request context builder
    * [#100](https://github.com/castle/castle-node/pull/100)

  - added request context builder
    * [#100](https://github.com/castle/castle-node/pull/100)

  - added device endpoints
    * [#106](https://github.com/castle/castle-node/pull/106)
    * [#107](https://github.com/castle/castle-node/pull/107)
    * [#108](https://github.com/castle/castle-node/pull/108)
    * [#109](https://github.com/castle/castle-node/pull/109)

   - added risk, filter, log endpoints
    * [#112](https://github.com/castle/castle-node/pull/112)
## 0.5.0

**Enhancements:**

- [#87](https://github.com/castle/castle-node/pull/87) added risk policy information to the authenticate response


## 0.4.7
**BREAKING CHANGES:**

- [#42](https://github.com/castle/castle-node//pull/42)
  * remove `identify` and `review` commands - they are no longer supported
  * renamed setUseWhitelist with setUseAllowlist

**Enhancements:**

- Re-publish to fix broken build

