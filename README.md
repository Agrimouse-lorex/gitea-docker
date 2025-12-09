Gitea Playwright Tests — Docker Setup & Usage

- Prereqs: Docker Desktop (or Docker Engine). Node.js is not required if you run everything inside Docker.

Build the image

- Run this from the repo root (note the trailing dot — build context):
- `docker build -t gitea-tests:latest .`
- If you see: `docker: 'docker buildx build' requires 1 argument` — you forgot the path (`.`).

Run tests (AUT on your host)

- Your Playwright config reads `BASE_URL` (defaults to `http://localhost:3000`).
- To point at a server running on your host machine from inside Linux container, use `host.docker.internal`:
- `docker run --rm -e BASE_URL=http://host.docker.internal:3000 gitea-tests:latest`

Run tests (AUT in another container)

- Create a network once: `docker network create gitea-net`
- Start Gitea (example): `docker run -d --name gitea --network gitea-net -p 3000:3000 gitea/gitea:latest`
- Run tests against it: `docker run --rm --network gitea-net -e BASE_URL=http://gitea:3000 gitea-tests:latest`

Run without building a custom image (optional)

- Use the official Playwright image and mount the project:
- Install deps: `docker run --rm -v ${PWD}:/app -w /app mcr.microsoft.com/playwright:v1.55.0-jammy npm ci --no-audit --no-fund`
- Run tests: `docker run --rm -v ${PWD}:/app -w /app -e BASE_URL=http://host.docker.internal:3000 mcr.microsoft.com/playwright:v1.55.0-jammy npm test`
- This is handy for quick local iterations; the Dockerfile approach is better for CI and reproducibility.

Image vs Container; run vs start

- `docker run` creates a new container from an image and starts it. You pass ports, env vars, volumes here.
- `docker start` only starts an existing (previously created by `run`) container with the same parameters as before.
- If you need to change ports/env/volumes, remove the old container and use `docker run` again.

Do my code changes go into the image?

- Yes, when you rebuild. The Dockerfile contains `COPY . .`, so your repo files are baked into the image at build time.
- Images are immutable — changes in your working directory do NOT affect an already-built image. Rebuild to include new changes:
- `docker build -t gitea-tests:latest .`

Git: push this project to your remote

- Initialize (if needed): `git init`
- Commit changes: `git add . && git commit -m "chore: initial setup"`
- Add remote (examples):
  - Gitea: `git remote add origin http://<your-gitea-host>/<user>/<repo>.git`
  - GitHub: `git remote add origin https://github.com/<user>/<repo>.git`
- Push: `git branch -M main` then `git push -u origin main`

Publish image to a registry (optional)

- Only needed if CI or others must pull your image.
- Tag: `docker tag gitea-tests:latest <registry>/<namespace>/gitea-tests:1.0.0`
- Login: `docker login <registry>`
- Push: `docker push <registry>/<namespace>/gitea-tests:1.0.0`

Notes

- `playwright.config.ts` accepts `BASE_URL`; default is `http://localhost:3000`.
- This repository has a `.dockerignore` to keep the build context small (node_modules, reports, traces, etc.).

Docker Compose (one command)

- Bring up Gitea and run tests in order: `docker compose up --build --abort-on-container-exit --exit-code-from tests`
- Cleanup: `docker compose down -v`
- It will:
  - Start `gitea` (preseeded to skip setup wizard, SQLite DB)
  - Create user `olektrom`/`Test123!` for login tests
  - Build the Playwright tests image and run tests against `http://gitea:3000`

CI pipelines

- Disabled for now. There are no active CI workflows in the repo.
- You can still run locally: `docker compose up --build --abort-on-container-exit --exit-code-from tests`
