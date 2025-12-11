# PDF Generation Instructions

This project includes scripts to generate a PDF version of the presentation.

## Prerequisites

Install dependencies:
```bash
npm install
```

## Method 1: Generate PDF from Dev Server (Recommended)

1. Start the dev server in one terminal:
```bash
npm run dev
```

2. In another terminal, run the PDF generator:
```bash
npm run generate-pdf
```

The PDF will be saved as `Titan-Presentation.pdf` in the root directory.

## Method 2: Generate PDF from Build

This method builds the project first, then generates the PDF:

```bash
npm run generate-pdf:build
```

## Output

The PDF file `Titan-Presentation.pdf` will be created in the main project folder with:
- 6 pages (one per slide)
- No navigation controls
- No progress bar
- Full-screen slide content

## Notes

- The PDF generation uses Puppeteer to capture screenshots of each slide
- Make sure your dev server is running on port 5173 (default Vite port) for Method 1
- The script automatically hides navigation controls and progress bars
- Each slide is captured at 1920x1080 resolution

