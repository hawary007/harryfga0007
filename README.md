<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1LOHa06PrZwjI6k456iVQYdSIOG15D0Dz

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in your environment for the API server. Optionally set `AUTH_TOKEN` to secure the endpoint.
3. If `AUTH_TOKEN` is used, expose it to the frontend as `VITE_AUTH_TOKEN` in `.env.local`.
4. Start the API server:
   `npm run server`
5. Run the app:
   `npm run dev`
