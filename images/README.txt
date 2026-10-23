IMAGES — what goes where
========================

images/
  portrait.jpg                  her photo (home intro circle + About page)
  exhibition-view.jpg           wide photo on the About page
  uploads/                      everything added through the /admin editor lands here (auto-resized WebP)
  paintings/
    <painting-id>/              one folder per painting, added by hand
      front.jpg                 straight-on photo of the painting                    required
      detail.jpg                close-up of surface / texture                        optional
      detail2.jpg / detail3.jpg more close-ups                                       optional
      edges.jpg                 side or edge view                                    optional
      room.jpg                  painting on a wall / in a room                       optional
      exhibition.jpg            installation view in a show                          optional
      artist.jpg                the artist with the painting                         optional

The site does not guess file names: whatever is listed under "images" for a painting in
data/paintings.json is what it shows. Through /admin this is filled in for you.

NAMING RULES (they matter on GitHub, which is case-sensitive)
- folder names: lowercase, hyphens, no spaces, no Turkish letters (ı ş ğ ç ö ü)
    good:  mavi-kompozisyon-1     untitled-no-4
    bad:   Mavi Kompozisyon 1     Untitled No.4.JPG
- paths in the data files are relative to the site root and never start with "/":
    images/paintings/becoming-one/front.jpg

IMAGE PREP (keeps the site fast and the repository small)
- JPG, long edge 2000–2400 px, quality ~80–85  →  usually 300–700 KB each
- straight-on, even daylight, colour-accurate; crop to the painting's edges for front.jpg
- ORIGINAL full-size photos live in ../originals/ (outside this repository) so they are
  never uploaded to GitHub. Put new originals there too.
