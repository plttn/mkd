# @plttn/mkd

## 0.2.3

### Patch Changes

- 9526050: fix mkd crashing with "is not a function" by dropping the CJS build

  mkd ran as CJS, which loaded ESM-only deps (slugify, filenamify) through
  require() at runtime. On newer Node versions this broke the CJS interop
  and made slugify undefined. mkd is a CLI, not a library other code
  requires, so it now builds and ships as ESM only.

## 0.2.2

### Patch Changes

- ed931b8: update to tsdown instead of tsup

## 0.2.1

### Patch Changes

- 9906f7e: fix sentinel date to be a date when it makes it to frontmatter

## 0.2.0

### Minor Changes

- 15f96d0: Use sentinel date when creating post

### Patch Changes

- Fix pnpm version
  fix copy in `publish` command
