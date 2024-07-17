# Random Meme Webapp

Built using Node.js v18.

Serves a HTML page that renders a randomly selected meme.

## Local Development

Start the local development server with live reload:

```
npm install
npm run dev
```

## Build the Container Image

Use the Docker or Podman CLI in the *application* directory:

```
podman build . -f Containerfile -t quay.io/rhdevelopers/random-meme
```