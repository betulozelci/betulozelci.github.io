IMAGES — what goes where
========================

images/
  portrait.jpg                  her photo (home intro circle + About page)       required
  studio.jpg                    studio photo (About page)                        optional
  paintings/
    <painting-id>/              ONE FOLDER PER PAINTING. Folder name = "id" in js/paintings.js
      front.jpg                 straight-on photo of the painting                required
      detail.jpg                close-up of surface / texture                    optional
      edges.jpg                 side or edge view                                optional
      room.jpg                  painting on a wall / in a room                   optional
      exhibition.jpg            installation view in a show                      optional
      artist.jpg                the artist with the painting                     optional
      detail2.jpg / detail3.jpg more close-ups                                   optional

NAMING RULES (they matter on GitHub)
- folder names: lowercase, hyphens, no spaces, no Turkish letters (ı ş ğ ç ö ü)
    good:  mavi-kompozisyon-1     untitled-no-4     sessiz-liman
    bad:   Mavi Kompozisyon 1     Untitled No.4     sessiz liman.JPG
- file names inside a folder are FIXED: front.jpg detail.jpg detail2.jpg detail3.jpg edges.jpg room.jpg exhibition.jpg artist.jpg  (lowercase, .jpg)
- ORIGINAL photos live in ../originals/ (outside the site) so they are not uploaded to GitHub.
  Put new originals there too; the web copies in here should be max 2000 px on the long edge.
- if you rename a folder, change its "id" in js/paintings.js to the same text,
  and list only the files you actually put in it under "views".

IMAGE PREP (keeps the site fast and the repo small)
- JPG, long edge 2000 px, quality ~80  →  usually 300–600 KB each
- straight-on, even daylight, colour-accurate; crop to the painting's edges for front.jpg
