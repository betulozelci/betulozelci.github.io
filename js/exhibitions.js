// ============================================================
//  EXHIBITIONS — one block per show, any order. Dates as "YYYY-MM-DD".
//
//  The site sorts them itself:
//    - shows whose end date is today or later  → "Upcoming exhibitions" on the home page (max 3, soonest first)
//    - shows that have already opened          → "Exhibitions" list on the About page (newest first)
//    (a show running today appears in both — it is current AND on her CV)
//  With no current or upcoming show, the home page says "No upcoming exhibitions at the moment."
//  url is optional (a link to the show's page). Leave "" if none.
//
//  Example — copy this block inside the [ ] below, one per show, separated by commas:
//  {
//    title: "Show Title",
//    venue: "Gallery Name",
//    city: "London",
//    start: "2026-06-10",
//    end: "2026-06-20",
//    url: ""
//  }
// ============================================================
window.EXHIBITIONS = [

];
