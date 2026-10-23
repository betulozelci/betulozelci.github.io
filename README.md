# betulozelci.github.io

Betul Özelçi's portfolio site. Plain HTML, CSS and JavaScript — no build step, no framework. GitHub Pages serves the files exactly as they are in this repository.

**Live site:** https://betulozelci.github.io (later: https://betulozelci.com)
**Editor:** https://betulozelci.github.io/admin/ — add paintings, exhibitions and photos without touching code.

## How it fits together

```
index.html              home: hero painting, intro, upcoming exhibitions, selected works
work.html               all works, with Surface and Year filters
work/painting.html      ONE page that shows any painting:  work/painting.html?p=<id>
about.html              portrait, statement, education / exhibitions / awards, wide photo, contact
privacy.html            privacy page (edit before going live)

data/site.json          name, tagline, email, Instagram, Behance, Saatchi, hero painting, photos   ┐
data/paintings.json     the paintings                                                              │ edited through
data/exhibitions.json   the shows (upcoming → home page, past → About page, automatic)             │ /admin
data/about.json         artist statement, education, awards                                        ┘

admin/index.html        the editor page (Sveltia CMS, loaded from a CDN)
admin/config.yml        which fields the editor shows, and where it saves them

js/main.js              reads data/*.json and fills the pages. Not edited day to day.
css/style.css           all styling
images/                 photos. The editor puts new uploads in images/uploads/ (auto-resized to WebP).
preview.bat             double-click to view the site on your own computer (see below)
.nojekyll               tells GitHub Pages not to process the files
```

## Day-to-day editing (for Betul)

1. Open **https://betulozelci.github.io/admin/** and sign in with GitHub.
2. **Paintings** → add or edit an entry → upload a front photo (any size; it is resized in the browser) → **Save**.
3. The site updates by itself about a minute later. Nothing else to do.

Rules of thumb:
- **Status** "Sold" shows a Sold label; "Available" plus a Saatchi Art link shows an *Available on Saatchi Art* button; "Available" without a link just says Available.
- **Show on home page** + **Order** decide which works appear under *Selected works* (max 9).
- **Exhibitions**: anything whose closing date is today or later appears on the home page as upcoming (max 3); anything that has opened appears on the About page. Both happen automatically from the dates.
- **Artist statement**: leave an empty line between paragraphs.
- **Awards & press** stays hidden until *Show awards & press* is on and the list has an entry.

## Previewing on your computer

The pages load their content from the `data/` files, which browsers refuse to do when a page is opened directly from the disk. So instead of double-clicking `index.html`, double-click **`preview.bat`**: it starts a tiny web server and opens http://localhost:8000/ in your browser. Close the black window to stop it. (Needs Python or Node.js installed — the script tells you if neither is found.)

## Editing the data files by hand

Everything the editor does can also be done by editing `data/*.json` in a text editor and pushing with GitHub Desktop. Keep the JSON valid (commas between entries, no trailing comma) — https://jsonlint.com will tell you if something is off. Image paths are relative to the site root: `images/paintings/becoming-one/front.jpg`.

Painting photos added by hand go in `images/paintings/<id>/` with the fixed names `front.jpg`, `detail.jpg`, `detail2.jpg`, `detail3.jpg`, `edges.jpg`, `room.jpg`, `exhibition.jpg`, `artist.jpg` — then list the ones you added under `images` in `data/paintings.json`. Long edge 2000–2400 px, JPG quality ~80–85. See `images/README.txt`.

## One-time setup of the editor (for Utku)

The editor runs in the browser and writes to this repository through GitHub, so GitHub has to know it is allowed to. Three steps, done once:

1. **GitHub OAuth App** (on the `betulozelci` account): GitHub → Settings → Developer settings → OAuth Apps → New OAuth App.
   Homepage URL `https://betulozelci.github.io`, Authorization callback URL `https://<worker-name>.<account>.workers.dev/callback` (you get the exact address in step 2 — you can come back and fix it). Copy the **Client ID** and generate a **Client secret**.
2. **Cloudflare Worker** — the small sign-in helper: https://github.com/sveltia/sveltia-cms-auth → "Deploy to Cloudflare Workers". Set the variables `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` (as a secret) and `ALLOWED_DOMAINS` = `betulozelci.github.io,betulozelci.com`. Note the worker URL.
3. Put the worker URL into `admin/config.yml` as `base_url`, commit, push. Open `/admin/`, sign in with GitHub, done.

If Betul edits from her own GitHub account instead of the `betulozelci` one, add her as a collaborator on the repository (Settings → Collaborators) with Write access.

## Deploying

GitHub Pages: repository **Settings → Pages → Source: Deploy from a branch → main, / (root)**. Every push to `main` is live within a minute or two.

Custom domain (when ready): add `betulozelci.com` under Settings → Pages → Custom domain and tick *Enforce HTTPS*; at Cloudflare create four `A` records for `@` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` and a `CNAME` for `www` → `betulozelci.github.io`, all **DNS only** (grey cloud).

All links and image paths in the site are relative (`images/...`, `../css/...`), never starting with `/`, so the same files work on localhost, on github.io and on the custom domain.
