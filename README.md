# Titan Presentation

A fullscreen presentation web app for Titan Global.sa's strategic air defense proposal to Leidos.

## Tech Stack

- **React** + **TypeScript** + **Vite**
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations

## Features

- Fullscreen presentation mode
- 6 slides with video and image backgrounds
- Ping-pong reverse-loop video playback at 0.6x speed
- Keyboard navigation (arrow keys, Esc to exit fullscreen)
- Smooth animations and transitions
- Responsive design

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

## Project Structure

```
src/
  ├── components/
  │   ├── PresentationShell.tsx  # Main presentation container
  │   ├── SlideView.tsx           # Individual slide renderer
  │   └── SlideControls.tsx       # Navigation controls
  ├── hooks/
  │   └── useFullscreen.ts        # Fullscreen API hook
  ├── slides.ts                    # Slide data
  ├── App.tsx                     # Main app component
  └── main.tsx                    # Entry point
```

## Media Files

Place media files in `/public/media/`:
- Videos: `.mp4` files
- Images: `.png` files
- Logo: `/public/media/logo.png`

