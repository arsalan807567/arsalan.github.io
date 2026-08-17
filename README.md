# Arsalan's Portfolio

Personal portfolio and blog, live at arsalanportfolio.live (GitHub Pages).

## What's here

A static site built with plain HTML, CSS, and JavaScript, showcasing AI and web development work: live project demos, a blog on AI topics, and an embedded RAG chatbot for visitor questions.

## Structure

```
index.html              Main portfolio page: hero, skills, services, project cards
blog.html                Blog index
blog-*.html               Individual blog posts
facp.html, claude-skills.html, prompts.html
                          Standalone project and resource pages
chatbot-widget.js, chatbot-widget.css
                          RAG chatbot widget (Cloudflare Workers AI backend)
sketch.js                 p5.js cursor follower animation
sitemap.xml                Search engine sitemap
assets/
  icons/                   Favicons, app icons, web manifest
  images/                  Hero image, profile photo, project previews, blog images
  videos/                  Project demo and slideshow videos
downloads/                 APK and skill package downloads
```

HTML pages stay at the repository root to preserve existing URLs, search engine indexing, and any external links. Only binary assets (images, icons, videos, downloads) are organized into folders.

## Featured projects

Live project cards on the homepage link out to deployed apps, including a real-time gesture recognition system (Gesture Intelligence Lab), an Instagram video downloader (Reelfetch), and several AI-powered tools and games.

## Deployment

Served directly via GitHub Pages from the `main` branch. Changes pushed to `main` go live automatically within a minute or two.

## Local development

No build step. Open `index.html` directly in a browser, or serve the folder with any static file server:

```bash
python3 -m http.server 8000
```
