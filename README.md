# Artist portfolio — test site

Plain HTML, CSS and JavaScript. No build step, no framework. Open `index.html` in a browser and it works; put the same files on GitHub Pages and it works there too.

## Folder map

```
index.html            home: hero painting, intro, exhibitions strip, selected works
work.html             all works, with Surface and Year filters
about.html            portrait, statement, education / exhibitions / awards, studio photo, contact
privacy.html          placeholder privacy page (edit before going live)
work/painting.html    ONE page that shows any painting:  work/painting.html?p=<painting-id>
css/style.css         all styling
js/site.js            name, tagline, email, Instagram, Saatchi profile, hero painting, photo paths   ← edit
js/paintings.js       the list of paintings                                                         ← edit
js/exhibitions.js     the list of shows                                                             ← edit
js/main.js            renders the pages from the three files above (no need to touch)
images/               photos — see images/README.txt for exact names
.nojekyll             tells GitHub Pages to serve the files as they are
```

## Adding a painting (3 steps)

1. Make a folder `images/paintings/<slug>/` — lowercase, hyphens, no spaces, no Turkish letters — and put `front.jpg` in it (plus `detail.jpg`, `edges.jpg`, `room.jpg` if you have them).
2. Open `js/paintings.js`, copy one `{ ... }` block, paste it, and set `id` to the same `<slug>`. Fill in the other fields. Set `views` to the files you actually added.
3. Save. Refresh the browser. Done — it appears on the Work page, in the filters, and (if `featured: true`) on the home page.

If a photo is missing or misnamed, the site shows a grey box saying `missing: images/...` with the exact path it expected. That's on purpose for testing.

## Adding an exhibition

Add a block to `js/exhibitions.js` with title, venue, city, start and end dates (`YYYY-MM-DD`). Current and future shows appear on the home page (max 3); past ones move to the About page by themselves. If nothing is upcoming, the home strip hides itself.

## Testing on your computer

Double-click `index.html`. Everything works from the file system, including the painting pages and filters. Check it on a phone too: on the same Wi-Fi, run a tiny server from the folder — `python3 -m http.server 8000` — and open `http://<your-computer-ip>:8000` on the phone.

## Putting it on GitHub Pages

1. Create a new repository on GitHub (public, no README).
2. Upload the **contents** of this folder to the repository root — `index.html` must be at the top level, not inside a `site/` folder.
3. In the repository: **Settings → Pages → Source: Deploy from a branch → Branch: main, folder: / (root) → Save**.
4. After a minute the site is live at `https://<username>.github.io/<repository-name>/`.

Every image and link in these files is a *relative* path (`images/...`, `../css/...`), never a path starting with `/`. That is what makes the site work both on your computer and under `github.io/<repository-name>/`. Keep it that way when editing.

## Later

This static version is for testing the design with real images. The plan after that: the same pages rebuilt in Astro with a Pages CMS form so she can add paintings without touching files, hosted on the same GitHub repository. Nothing done here is wasted — the CSS, the page structure and the data fields carry over as they are.
