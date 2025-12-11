import puppeteer from 'puppeteer';
import { PDFDocument } from 'pdf-lib';
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

async function generatePDF() {
  console.log('🚀 Starting PDF generation...');
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    
    // Set viewport to match presentation size (full screen)
    await page.setViewport({
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1
    });
    
    // Set content to fill entire viewport
    await page.evaluate(() => {
      document.body.style.margin = '0';
      document.body.style.padding = '0';
      const root = document.getElementById('root');
      if (root) {
        root.style.width = '100vw';
        root.style.height = '100vh';
        root.style.margin = '0';
        root.style.padding = '0';
      }
    });

    // Navigate to local dev server
    const baseUrl = process.env.VITE_BASE_URL || 'http://localhost:5173';
    console.log(`📍 Navigating to ${baseUrl}...`);
    
    await page.goto(baseUrl, {
      waitUntil: 'networkidle0',
      timeout: 30000
    });

    // Wait for React to render
    await page.waitForTimeout(3000);

    const pdfPages = [];
    const totalSlides = 6;

    // Generate PDF for each slide
    for (let i = 0; i < totalSlides; i++) {
      console.log(`📄 Capturing slide ${i + 1}/${totalSlides}...`);
      
      // Navigate to slide by clicking next button (except for first slide)
      if (i > 0) {
        // Click the next button
        await page.evaluate(() => {
          // Find the next button (right arrow)
          const buttons = Array.from(document.querySelectorAll('button'));
          const nextButton = buttons.find(btn => {
            const svg = btn.querySelector('svg');
            if (!svg) return false;
            const path = svg.querySelector('path');
            return path && path.getAttribute('d')?.includes('M9 5l7 7');
          });
          if (nextButton && !nextButton.disabled) {
            nextButton.click();
          }
        });
        await page.waitForTimeout(1500); // Wait for slide transition
      }

      // Hide navigation controls and progress bar
      await page.evaluate(() => {
        // Hide all fixed bottom elements (controls)
        const fixedBottom = document.querySelectorAll('[class*="fixed"][class*="bottom"]');
        fixedBottom.forEach(el => {
          el.style.display = 'none';
        });
        
        // Also hide by z-index (controls are usually z-50)
        const highZIndex = document.querySelectorAll('[class*="z-50"], [class*="z-40"]');
        highZIndex.forEach(el => {
          if (el.classList.contains('fixed') && el.classList.contains('bottom')) {
            el.style.display = 'none';
          }
        });
        
        // Ensure full viewport coverage
        document.body.style.margin = '0';
        document.body.style.padding = '0';
        document.body.style.width = '100vw';
        document.body.style.height = '100vh';
        document.body.style.overflow = 'hidden';
        
        const root = document.getElementById('root');
        if (root) {
          root.style.margin = '0';
          root.style.padding = '0';
          root.style.width = '100vw';
          root.style.height = '100vh';
          root.style.overflow = 'hidden';
        }
        
        // Make sure slide containers fill viewport
        const slideContainers = document.querySelectorAll('[class*="w-full"], [class*="h-full"], [class*="h-screen"]');
        slideContainers.forEach(container => {
          container.style.width = '100vw';
          container.style.height = '100vh';
          container.style.margin = '0';
          container.style.padding = '0';
        });
      });

      await page.waitForTimeout(500);

      // Ensure content fills the page
      await page.evaluate(() => {
        const root = document.getElementById('root');
        if (root) {
          root.style.width = '100vw';
          root.style.height = '100vh';
          root.style.margin = '0';
          root.style.padding = '0';
          root.style.overflow = 'hidden';
        }
        // Make sure all slide containers fill the viewport
        const slideContainers = document.querySelectorAll('[class*="w-full"][class*="h-full"], [class*="h-screen"]');
        slideContainers.forEach(container => {
          container.style.width = '100vw';
          container.style.height = '100vh';
          container.style.margin = '0';
          container.style.padding = '0';
        });
      });

      // Capture this slide as PDF with exact dimensions
      const pdfBuffer = await page.pdf({
        width: '1920px',
        height: '1080px',
        printBackground: true,
        preferCSSPageSize: true,
        margin: {
          top: '0',
          right: '0',
          bottom: '0',
          left: '0'
        },
        scale: 1
      });

      pdfPages.push(pdfBuffer);
    }

    // Combine all pages into one PDF
    console.log('📚 Combining PDF pages...');
    const pdfDoc = await PDFDocument.create();

    for (const pdfBuffer of pdfPages) {
      const loadedPdf = await PDFDocument.load(pdfBuffer);
      const [existingPdf] = await pdfDoc.embedPdf(loadedPdf);
      const page = pdfDoc.addPage([1920, 1080]);
      // Scale to fill entire page
      const scaleX = 1920 / existingPdf.width;
      const scaleY = 1080 / existingPdf.height;
      const scale = Math.max(scaleX, scaleY);
      page.drawPage(existingPdf, {
        xScale: scale,
        yScale: scale,
        x: 0,
        y: 0
      });
    }

    // Save PDF
    const pdfBytes = await pdfDoc.save();
    const outputPath = join(rootDir, 'Titan-Presentation.pdf');
    
    writeFileSync(outputPath, pdfBytes);
    
    console.log(`✅ PDF saved successfully to: ${outputPath}`);
    console.log(`📊 Total pages: ${totalSlides}`);
  } catch (error) {
    console.error('❌ Error generating PDF:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

// Check if dev server is running
const baseUrl = process.env.VITE_BASE_URL || 'http://localhost:5173';
console.log(`\n⚠️  Make sure your dev server is running at ${baseUrl}`);
console.log('   Run: npm run dev\n');

generatePDF().catch((error) => {
  console.error('Failed to generate PDF:', error);
  process.exit(1);
});
