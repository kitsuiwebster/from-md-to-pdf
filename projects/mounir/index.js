const fs = require('fs');
const puppeteer = require('puppeteer');
const marked = require('marked');
const path = require('path');

(async () => {
    console.log("👉 Starting script execution...");
    const inputPath = 'inputs/story.md';
    console.log(`👉 Reading Markdown content from ${inputPath}`);
    const markdownContent = fs.readFileSync(inputPath, 'utf8');

    console.log("👉 Converting Markdown to HTML...");
    const htmlContent = marked.parse(markdownContent, { sanitize: false });

    const stylesPath = 'css/default.css'; 
    console.log(`👉 Reading CSS styles from ${stylesPath}...`);
    const cssStyles = fs.readFileSync(stylesPath, 'utf8');

    console.log("👉 Combining CSS styles with HTML content...");
    const fullHtmlContent = `<style>${cssStyles}</style>\n${htmlContent}`;

    console.log("👉 Ensuring 'html' directory exists...");
    fs.mkdirSync('html', { recursive: true });

    const htmlPath = 'html/output.html'; 
    console.log(`👉 Writing HTML content to ${htmlPath}...`);
    fs.writeFileSync(htmlPath, fullHtmlContent);

    console.log("👉 Launching Puppeteer...");
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    console.log(`👉 Navigating to the local HTML file at '${htmlPath}'...`);
    const fileUrl = `file://${path.join(__dirname, htmlPath)}`;
    await page.goto(fileUrl, { waitUntil: 'networkidle0' });

    const outputPath = 'outputs/output.pdf';
    console.log(`👉 Generating PDF and saving to ${outputPath}...`);
    await page.pdf({
        path: outputPath,
        format: 'A4',
        margin: {
            top: '2cm',
            right: '2cm',
            bottom: '2cm',
            left: '2cm'
        }
    });

    console.log("👉 PDF generation complete. Closing Puppeteer...");
    await browser.close();

    console.log("👉 Script execution finished.");
})();
