---
"@plttn/mkd": patch
---

fix mkd crashing with "is not a function" by dropping the CJS build

mkd ran as CJS, which loaded ESM-only deps (slugify, filenamify) through
require() at runtime. On newer Node versions this broke the CJS interop
and made slugify undefined. mkd is a CLI, not a library other code
requires, so it now builds and ships as ESM only.
