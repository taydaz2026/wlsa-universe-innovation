# Publish and update the site on GitHub

This folder is the whole website. There is nothing to build or install. Once published it lives at:

`https://<your-github-username>.github.io/<repository-name>/`

Suggested repository name: `wlsa-innovation-universe`

There are two ways to publish. **Way 1 (scripts)** is easiest and makes later updates one double-click. **Way 2 (browser upload)** needs no software at all.

---

## Before you publish: 5-minute checklist

The site will be **public**: anyone with the link can open it, and search engines may find it.

- [ ] **Staff names.** It shows names and roles (Slava Matvejevs, Darren Taylor, Jose Dominguez, Jing Wu, Jackey, Jimmy, Johnson, Sofian). Confirm everyone is happy to be listed publicly.
- [ ] **School crest.** `wlsa-logo.png` is the school crest. Confirm the school allows it on a public page.
- [ ] **Placeholder text.** Many planets still say "Details to be confirmed" or "Part of …". Visitors will see it. All wording is in `universe-data.js`.
- [ ] **No private data.** The site has no student data, passwords, keys or internal links, and loads nothing from the internet.
- [ ] **Which GitHub account.** A school account is easier to hand over later than a personal one. [confirm with school policy]

**Mainland China:** `github.io` addresses can be slow or blocked from some networks there. Test the live link on the school network and on a phone with mobile data before sharing it widely. [confirm] If it is unreliable, this same folder works on any ordinary web server.

---

## Way 1: the scripts (recommended)

### One-time setup

1. Sign in at https://github.com (create a free account if needed).
2. Click **+** (top right) → **New repository**. Name it `wlsa-innovation-universe`, choose **Public**, leave **"Add a README" unticked**, click **Create repository**.
3. Copy the repository address shown (it looks like `https://github.com/yourname/wlsa-innovation-universe.git`).
4. **Copy this whole folder out of OneDrive**, for example to `C:\Sites\wlsa-innovation-universe`. OneDrive can damage git's hidden `.git` folder, so always work from the copy.
5. In the copy, double-click **`setup-github.bat`**.
6. Paste the repository address, then your name and email when asked. A GitHub sign-in window opens the first time; sign in.
7. When it says **Done**, go to your repository on github.com → **Settings → Pages** → Source: **Deploy from a branch** → Branch: **main**, folder **/ (root)** → **Save**.
8. Wait 1–3 minutes. Refresh the Pages settings page: it shows **Your site is live at …**. Send that link to colleagues.

If Windows says the script is blocked: right-click `setup-github.ps1` → **Properties** → tick **Unblock** → OK, then try again. (This happens when the folder came from a zip or email.)

### Every update after that

1. Edit the files in your copy (see "What to edit" below). Most changes are in **`universe-data.js`**.
2. Check it: open `index.html` in Chrome or Edge and click around.
3. Double-click **`publish-update.bat`**. It lists what changed, asks for a few words describing it, and sends it to GitHub. It also refreshes the page's version number so visitors do not see an old cached copy.
4. Wait 1–3 minutes, then press **Ctrl+F5** on the live site.

If it says the upload was refused, you (or a colleague) changed something on github.com directly. Open PowerShell in the folder, run `git pull --rebase origin main`, then double-click `publish-update.bat` again.

---

## Way 2: upload in the browser (no software)

1. Sign in at https://github.com → **+** → **New repository** → name `wlsa-innovation-universe` → **Public** → leave "Add a README" unticked → **Create repository**.
2. On the empty repository page click **uploading an existing file**.
3. In File Explorer open this folder and press **Ctrl+A**. **Drag the files, not the folder itself**, onto the page, so `index.html` ends up at the top level. (You do not need to upload the `.ps1` and `.bat` files in this way; they are harmless if you do.)
4. If a file shows "Something went really wrong, and we can't process that file", click the **×** next to it and carry on. Every file here has content, and `.nojekyll` is optional.
5. Scroll down, write a message such as `Publish site`, click **Commit changes**. Check `index.html` is listed at the top level.
6. **Settings → Pages** → Source: **Deploy from a branch** → Branch **main**, **/ (root)** → **Save**. Wait 1–3 minutes.

**To update this way:** open the file on GitHub, click the pencil icon, edit, **Commit changes**. Or **Add file → Upload files** to replace a file. Then wait a few minutes and press **Ctrl+F5**.

---

## What to edit

Use the preview-then-approve routine: change a copy, look at it, then publish.

| I want to… | Edit |
|---|---|
| Change a name, lead, description or the wording of a planet | `universe-data.js` |
| Add a new universe | `universe-data.js`: add one block to `systems`, and give a planet in its parent `children:'<id>'` |
| Add or remove a connection between worlds | `universe-data.js`: the `links` list at the bottom |
| Change the AI icon | `universe-data.js`: the `chipIcon` function near the top |
| Change colours of a universe | `universe-data.js`: its `theme` line |
| Change the school logo | replace `wlsa-logo.png` (same file name) |

The map builds itself from the data, so no layout work is needed. Text starting "Placeholder" or "Part of" is waiting for real descriptions.

---

## Going back to an earlier version

- **Script way:** on github.com open the repository → **Commits** → find the good version → **Browse files** to see it, or ask for help reverting it.
- **Safest habit:** keep a copy of the folder before big edits.

---

## Optional: a custom address (for example `universe.yourschool.edu`)

1. **Settings → Pages → Custom domain**, type the address, **Save**.
2. Ask whoever manages the school's domain to add a **CNAME** record pointing to `<your-github-username>.github.io`.
3. Tick **Enforce HTTPS** when it becomes available. [confirm DNS details with your IT team]

---

## Troubleshooting

| Problem | Likely cause and fix |
|---|---|
| Page shows only the repository name, or "404 — There isn't a GitHub Pages site here" | `index.html` is not at the top level (the folder was uploaded instead of its contents), or Pages is not switched on, or the repository is private. Check **Settings → Pages**, and that the repository is **Public**. [confirm: private-repository Pages depends on your GitHub plan] |
| Blank page | Same as above: re-upload the folder's *contents*. |
| Page loads but looks unstyled or broken | A file did not upload. All 14 site files must be present: `index.html`, `404.html`, `universe-data.js`, `graph.js`, `app-1.js` to `app-5.js`, `styles-1.css` to `styles-4.css`, `wlsa-logo.png`. |
| Still the old version | Press **Ctrl+F5**, or wait a few minutes. |
| "git is not installed" | Install from https://git-scm.com/download/win, then run the script again. |
| "The upload failed" in setup | The repository must be **empty** (no README), and you must sign in to GitHub when the window opens. |
| Does not open from mainland China | See the note above. Test from the school network. [confirm] |

---

## What is in this folder

| File | Purpose |
|---|---|
| `index.html` | The page |
| `universe-data.js` | **All the content.** |
| `graph.js` | Builds the map from the data |
| `app-1.js`, `app-2.js` | The original iWLSA universe |
| `app-3.js` | Navigation, universes and the guided tour |
| `app-4.js` | The draggable, collapsible, resizable map |
| `app-5.js` | Search across all universes |
| `styles-1.css` … `styles-4.css` | Appearance |
| `wlsa-logo.png` | School crest |
| `404.html` | Page shown for a wrong address |
| `setup-github.bat` / `.ps1` | One-time upload to GitHub |
| `publish-update.bat` / `.ps1` | Send changes to GitHub |
| `.nojekyll`, `.gitignore` | Housekeeping |
| `README.md`, `PUBLISH-TO-GITHUB.md` | Documentation (not needed by the site) |
