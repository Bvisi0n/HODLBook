# 📝 Commit Message Guidelines – HODLBook

This convention keeps commits readable, logical, and useful — without the overhead of GitHub issue linking.

---

## ✅ Format

```
[Action] [Scope]: [Short summary]

- [What was done]
- [Why it was needed or what it enables]
- [Any edge cases, file locations, or future notes]
```

---

## 🧩 Examples

```
Add backend: Flask server with browser auto-launch

- Created main.py with Flask serving from /web
- Added browser auto-launch via threading
- Confirmed working with .bat launcher
```

```
Fix batch: added pause to show Python errors

- Prevented auto-closing terminal on crash
- Helps reveal missing dependencies like Flask
```

```
Update config: moved portfolio file to /data directory

- Renamed to portfolio.local.json
- Ensured user data stays outside Git tracking
```

---

## 🔧 Actions

| Action     | Use when…                        |
|------------|----------------------------------|
| `Add`      | New feature, file, or capability |
| `Fix`      | Bugfix or runtime error          |
| `Update`   | Behavioral or content changes    |
| `Refactor` | Code cleanup, no behavior change |
| `Remove`   | Deleting unused code or assets   |
| `Docs`     | Documentation or internal notes  |

---

## 📦 Scopes

Free-form but consistent. Examples:

- `backend` – Flask logic, Python code
- `frontend` – HTML, JS, visual structure
- `api` – Endpoints under /api
- `batch` – .bat launcher or CLI tools
- `config` – Paths, JSON, .gitignore
- `html`, `style`, `icons`, etc.

---

## 💡 Notes

- Bullet points are required — they improve readability.
- Keep commits focused. One action = one commit.
- No GitHub issue references needed (`Closes #xx`) — this project doesn't use Issues (yet).