// ============================================================
//  PAINTINGS — one block { ... } per painting.
//
//  id        = the FOLDER name under images/paintings/  (lowercase, hyphens, no spaces, no Turkish letters)
//  surface   = "canvas" or "paper"   (drives the filter on the Work page — only these two words)
//  status    = "available" or "sold"
//  featured  = true shows it in "Selected works" on the home page (pick 6–9); order = position there
//  views     = which image files exist in the folder, WITHOUT ".jpg". "front" is required.
//              Allowed names: "front", "detail", "detail2", "detail3", "edges", "room", "exhibition", "artist"
//  Newest year appears first everywhere. Within a year, lower "order" first.
// ============================================================
window.PAINTINGS = [
  {
    id: "becoming-one",
    title: "Becoming One",
    year: 2026,
    surface: "canvas",
    medium: "Mixed media on canvas",
    width_cm: 170,
    height_cm: 178.5,
    status: "available",
    saatchi_url: "",
    featured: true,
    order: 1,
    views: ["front", "detail", "detail2", "exhibition"],
    description: ""
  },
  {
    id: "wcbt",
    title: "We Can Be Together",
    year: 2026,
    surface: "canvas",
    medium: "Mixed media on raw canvas",
    width_cm: 228,
    height_cm: 170,
    status: "available",
    saatchi_url: "",
    featured: true,
    order: 2,
    views: ["front", "detail", "exhibition"],
    description: ""
  },
  {
    id: "one-last-time",
    title: "One Last Time",
    year: 2026,
    surface: "canvas",
    medium: "Mixed media on canvas",
    width_cm: 106,
    height_cm: 111.5,
    status: "available",
    saatchi_url: "",
    featured: true,
    order: 3,
    views: ["front", "detail"],
    description: ""
  },
  {
    id: "pale-olive",
    title: "Pale Olive",
    year: 2026,
    surface: "canvas",
    medium: "Mixed media on canvas",
    width_cm: 66,
    height_cm: 91,
    status: "available",
    saatchi_url: "",
    featured: true,
    order: 4,
    views: ["front", "detail"],
    description: ""
  },
  {
    id: "breeding-lilac",
    title: "Breeding Lilac",
    year: 2026,
    surface: "canvas",
    medium: "Mixed media on canvas",
    width_cm: 49,
    height_cm: 69.5,
    status: "available",
    saatchi_url: "",
    featured: true,
    order: 5,
    views: ["front", "detail"],
    description: ""
  },
  {
    id: "trial",
    title: "Trial",
    year: 2026,
    surface: "canvas",
    medium: "Mixed media on canvas",
    width_cm: 45,
    height_cm: 50.5,
    status: "available",
    saatchi_url: "",
    featured: true,
    order: 6,
    views: ["front", "detail"],
    description: ""
  }
];
