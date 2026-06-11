# Fern SDK generator (proposal)

> **Proposal / draft.** This directory scaffolds a [Fern](https://buildwithfern.com)
> based generator for the TypeScript SDK. It is not yet wired into the release
> process.

## Layout

```
fern/
├── fern.config.json      # Fern organization + CLI version
├── generators.yml        # generator groups (ts-sdk)
└── openapi/
    └── openapi.yml        # OpenAPI spec (scoring, Lists, Privacy, Events)
```

## Usage

```bash
npm install -g fern-api

# Validate the spec and generator config
fern check

# Generate the TypeScript SDK locally
fern generate --group ts-sdk --local
```

Generated output is written to `../generated/typescript` and is **not** committed
to this repository.
