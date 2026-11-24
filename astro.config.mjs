import { defineConfig } from 'astro/config';

// Static site for GitHub Pages at the root of the user/organization domain,
// so no `base` is set. Keep `site` equal to the Pages URL: canonical links are built from it.
export default defineConfig({
  site: 'https://yogeshwaranarc.github.io',
  trailingSlash: 'always',
});
