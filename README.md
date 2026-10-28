# WLSA Innovation & Technology Universe

An interactive map of the WLSA Innovation & Technology department: a standalone planet that opens into five areas, each with its own nested universes.

**Live site:** `https://<your-github-username>.github.io/<repository-name>/`  *(fill in after publishing)*

## What it shows

| Area | Lead |
|---|---|
| AI (the iWLSA universe and AI Education) | Darren Taylor |
| 3D & Prototyping | Jose Dominguez |
| Pedagogical & Internship Programs | Jing Wu |
| Network & System Architecture (Jackey's and Jimmy's systems) | Jackey & Jimmy |
| School Systems | Johnson |

Under the Innovation & Technology planet (Slava Matvejevs) there are 26 universes. Every universe has a guided tour. A draggable, collapsible, resizable map shows how everything connects, and the search bar finds planets, people and topics across all universes.

## Run it locally

No build step and no dependencies. Open `index.html` in Chrome or Edge, or serve the folder:

```
python -m http.server 8000
```

then visit http://localhost:8000. Addresses use the `#` part to remember where you are, for example `#/innovation/pedag/intern`.

## Edit the content

Everything visitors read lives in **`universe-data.js`**:

- **Add a universe:** add one block to `systems`, and give a planet in its parent `children:'<id>'`.
- **Add a connection between worlds:** add a row to `links`, for example `['proto:interns','pedag:internship',S]`.
- **The AI icon** is drawn by `chipIcon` at the top of the file.
- Text starting "Placeholder" or "Part of" is waiting for real descriptions.

`graph.js` builds the map from that data automatically.

## Publish and update

See **[PUBLISH-TO-GITHUB.md](PUBLISH-TO-GITHUB.md)**. In short: run `setup-github.bat` once, then `publish-update.bat` after every change.

## Files

`index.html` · `universe-data.js` · `graph.js` · `app-1.js` … `app-5.js` · `styles-1.css` … `styles-4.css` · `wlsa-logo.png` · `404.html` · `setup-github.*` · `publish-update.*`

## Privacy

The site is static. It uses no cookies, analytics or logins, and loads nothing from outside its own files. It contains no student data.

## Ownership

© WLSA Shanghai Academy. The school crest and name are the school's. No open-source licence is granted. [confirm the intended licence or usage terms with the school]
