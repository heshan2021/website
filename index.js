/**
 * Figma-to-Code Main Entry Point
 * Exports Figma designs to code
 */

const fs = require('fs');
const path = require('path');
const figmaAuth = require('./figmaAuth');
const designParser = require('./designParser');
const codeGenerator = require('./codeGenerator');

async function main() {
  try {
    console.log('🚀 Figma-to-Code Generator\n');

    // 1. Test authentication
    console.log('Step 1: Testing Figma authentication...');
    const isAuthenticated = await figmaAuth.testAuth();
    
    if (!isAuthenticated) {
      console.error('❌ Authentication failed. Please check your token.');
      process.exit(1);
    }
    console.log('✓ Authentication successful\n');

    // 2. Get file information
    const fileId = process.env.FIGMA_FILE_ID;
    if (!fileId) {
      console.warn('⚠️  FIGMA_FILE_ID not set in .env file');
      console.log('To use this tool, set FIGMA_FILE_ID in your .env file');
      console.log('File ID can be found in the Figma file URL: figma.com/file/{FILE_ID}/...\n');
      return;
    }

    console.log('Step 2: Fetching Figma file...');
    const file = await figmaAuth.getFile(fileId);
    console.log(`✓ File retrieved: "${file.name}"\n`);

    // 3. Parse design data
    console.log('Step 3: Parsing design data...');
    const designs = designParser.parseDesignData(file);
    console.log(`✓ Found ${designs.pages.length} page(s)\n`);

    // 4. Generate code from designs
    console.log('Step 4: Generating React components...');
    const outputDir = path.join(__dirname, 'generated');
    
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }

    // Generate components from each page's frames
    let componentCount = 0;
    designs.pages.forEach(page => {
      console.log(`\n  Page: ${page.name}`);
      
      page.frames.forEach(frame => {
        const componentName = frame.name;
        const fileName = componentName.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '');
        
        // Generate React component
        const jsxCode = codeGenerator.generateReactComponent(frame, componentName);
        const jsxPath = path.join(outputDir, `${fileName}.jsx`);
        fs.writeFileSync(jsxPath, jsxCode);
        
        // Generate CSS
        const cssCode = codeGenerator.generateCSS(frame, componentName);
        const cssPath = path.join(outputDir, `${fileName}.css`);
        fs.writeFileSync(cssPath, cssCode);
        
        console.log(`    ✓ Generated ${fileName}.jsx & ${fileName}.css`);
        componentCount++;
      });
    });

    console.log(`\n✅ Code generation complete!`);
    console.log(`📁 Generated ${componentCount} component(s) in ./generated folder\n`);
    console.log('Generated files:');
    console.log('  - React components (.jsx)');
    console.log('  - CSS files (.css)\n');

  } catch (error) {
    console.error('Fatal error:', error.message);
    console.error('\nTroubleshooting:');
    console.error('  - Check that FIGMA_FILE_ID in .env is correct');
    console.error('  - Make sure you have access to the Figma file');
    console.error('  - Try extracting a shorter file ID from your URL');
    process.exit(1);
  }
}

main();
