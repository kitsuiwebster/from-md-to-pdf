const fs = require('fs');
const puppeteer = require('puppeteer');
const marked = require('marked');
const path = require('path');

(async () => {
    // Read the markdown content
    const markdownContent = fs.readFileSync('inputs/story.md', 'utf8');

    const localServerBasePath = `http://localhost:4005`;

    // Replace relative image paths with absolute server paths
    const processedContent = markdownContent.replace(/!\[(.*?)\]\((pictures\/.*?\.(?:png|jpg|jpeg|gif))\)/g, (match, alt, imagePath) => {
        // Construct the local server path
        const localServerImagePath = `${localServerBasePath}/${imagePath}`;
        console.log(`Converted image path: ${localServerImagePath}`); // Output the converted path for verification
        // Return the Markdown image syntax with the local server path
        return `![${alt}](${localServerImagePath})`;
    });

    // Convert Markdown content to HTML
    const htmlContent = marked.parse(processedContent);

    // Read CSS styles from an external file
    const cssStyles = fs.readFileSync('css/default.css', 'utf8');

    // Embed the CSS styles in a <style> tag
    const fullHtmlContent = `<style>${cssStyles}</style>\n${htmlContent}`;

    // Ensure the html directory exists
    fs.mkdirSync('html', { recursive: true });
    
    // Write the HTML content to a new file
    const outputPathHtml = 'html/output.html';
    fs.writeFileSync(outputPathHtml, fullHtmlContent);

    // Launch Puppeteer
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Navigate to the local HTML file
    const fileUrl = `file://${path.join(__dirname, outputPathHtml)}`;
    await page.goto(fileUrl, { waitUntil: 'networkidle0' });

    // Save the page as a PDF
    const outputPathPdf = 'outputs/output.pdf';
    await page.pdf({ path: outputPathPdf, format: 'A4' });

    await browser.close();
})();
