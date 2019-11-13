These docs are hosted at [docs.oasis.dev](https://docs.oasis.dev) and are built using [Vuepress](https://vuepress.vuejs.org).

## Contributing

You can help make these docs excellent by submitting issues and PRs for things that are unclear or need improvement.

When adding new files, be sure to add the paths to [this file](./src/.vuepress/config.js), otherwise the files will not be displayed. 

## Generating the docs

To preview docs as you're editing them, run `cd src && npx vuepress dev`.
Please try to do this when creating large PRs.

Don't worry about building the docs (using `vuepress build`).
CI does this for you when your PR is merged, which means that small changes can be made directly from the web UI.
