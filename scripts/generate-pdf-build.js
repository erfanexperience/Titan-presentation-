import puppeteer from 'puppeteer';
import { PDFDocument } from 'pdf-lib';
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

async function generatePDF() {
  console.log('🚀 Starting PDF generation...');
  
  // First, build the project
  console.log('📦 Building project...');
  try {
    execSync('npm run build', { cwd: rootDir, stdio: 'inherit' });
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }

  // Start preview server
  console.log('🌐 Starting preview server...');
  const previewProcess = execSync('npm run preview', { 
    cwd: rootDir, 
    stdio: 'pipe',
    detached: true 
  });

  // Wait for server to start
  await new Promise(resolve => setTimeout(resolve, 5000));

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    
    // Set viewport to match presentation size
    await page.setViewport({
      width: 1920,
      height: 1080,
      deviceScaleFactor: 2
    });

    // Navigate to preview server
    const baseUrl = 'http://localhost:4173';
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
      });

      await page.waitForTimeout(500);

      // Capture this slide as PDF
      const pdfBuffer = await page.pdf({
        width: '1920px',
        height: '1080px',
        printBackground: true,
        preferCSSPageSize: false,
        margin: {
          top: '0',
          right: '0',
          bottom: '0',
          left: '0'
        }
      });

      pdfPages.push(pdfBuffer);
    }

    // Combine all pages into one PDF
    console.log('📚 Combining PDF pages...');
    const pdfDoc = await PDFDocument.create();

    for (const pdfBuffer of pdfPages) {
      const [existingPdf] = await pdfDoc.embedPdf(await PDFDocument.load(pdfBuffer));
      const page = pdfDoc.addPage([1920, 1080]);
      page.drawPage(existingPdf);
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
    // Kill preview server
    try {
      process.kill(-previewProcess.pid);
    } catch (e) {
      // Ignore
    }
  }
}

generatePDF().catch((error) => {
  console.error('Failed to generate PDF:', error);
  process.exit(1);
});

