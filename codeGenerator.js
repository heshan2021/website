/**
 * React Code Generator
 * Converts Figma design data to React components
 */

/**
 * Generate React component from Figma frame
 * @param {object} frame - Figma frame object
 * @param {string} componentName - React component name
 * @returns {string} - React component code
 */
function generateReactComponent(frame, componentName = 'Component') {
  const safeName = componentName.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '');
  
  let jsx = `import React from 'react';\n\n`;
  jsx += `export default function ${safeName}() {\n`;
  jsx += `  return (\n`;
  jsx += `    <div className="${safeName}__container" style={{\n`;
  jsx += `      width: '${frame.width}px',\n`;
  jsx += `      height: '${frame.height}px',\n`;
  jsx += `    }}>\n`;
  
  // Add children elements
  if (frame.children && frame.children.length > 0) {
    jsx += generateChildrenJSX(frame.children, 2);
  } else {
    jsx += `      <div>Frame content</div>\n`;
  }

  jsx += `    </div>\n`;
  jsx += `  );\n`;
  jsx += `}\n`;

  return jsx;
}

/**
 * Generate JSX for child elements
 * @param {array} children - Child elements
 * @param {number} indentLevel - Indentation level
 * @returns {string} - JSX code
 */
function generateChildrenJSX(children, indentLevel = 1) {
  const indent = ' '.repeat(indentLevel * 2);
  let jsx = '';

  children.forEach((child, index) => {
    const elementName = child.name.replace(/\s+/g, '-').toLowerCase();
    
    switch (child.type) {
      case 'TEXT':
        jsx += `${indent}<h2 className="${elementName}">${child.text || 'Text'}</h2>\n`;
        break;
      case 'RECTANGLE':
      case 'ELLIPSE':
        jsx += `${indent}<div className="${elementName}" style={{\n`;
        jsx += `${indent}  width: '${child.width}px',\n`;
        jsx += `${indent}  height: '${child.height}px',\n`;
        jsx += `${indent}  backgroundColor: '${getFillColor(child.fills)}',\n`;
        jsx += `${indent}}}></div>\n`;
        break;
      case 'IMAGE':
        jsx += `${indent}<img src="image-${index}.png" alt="${child.name}" style={{\n`;
        jsx += `${indent}  width: '${child.width}px',\n`;
        jsx += `${indent}  height: '${child.height}px',\n`;
        jsx += `${indent}}} />\n`;
        break;
      case 'GROUP':
      case 'FRAME':
        jsx += `${indent}<div className="${elementName}">\n`;
        if (child.children) {
          jsx += generateChildrenJSX(child.children, indentLevel + 1);
        }
        jsx += `${indent}</div>\n`;
        break;
      default:
        jsx += `${indent}<div className="${elementName}">{/* ${child.type} */}</div>\n`;
    }
  });

  return jsx;
}

/**
 * Get hex color from Figma fill
 * @param {array} fills - Figma fill objects
 * @returns {string} - Hex color code
 */
function getFillColor(fills) {
  if (!fills || fills.length === 0) return '#FFFFFF';
  
  const fill = fills[0];
  if (fill.type === 'SOLID' && fill.color) {
    const { r, g, b } = fill.color;
    return `#${Math.round(r * 255).toString(16).padStart(2, '0')}${Math.round(g * 255).toString(16).padStart(2, '0')}${Math.round(b * 255).toString(16).padStart(2, '0')}`.toUpperCase();
  }
  
  return '#FFFFFF';
}

/**
 * Generate CSS file for component
 * @param {object} frame - Figma frame object
 * @param {string} componentName - Component name
 * @returns {string} - CSS code
 */
function generateCSS(frame, componentName) {
  const safeName = componentName.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '');
  
  let css = `/* Styles for ${safeName} Component */\n\n`;
  css += `.${safeName}__container {\n`;
  css += `  display: flex;\n`;
  css += `  flex-direction: column;\n`;
  css += `  align-items: center;\n`;
  css += `  justify-content: center;\n`;
  css += `}\n\n`;

  if (frame.children) {
    frame.children.forEach(child => {
      const elementName = child.name.replace(/\s+/g, '-').toLowerCase();
      css += `.${elementName} {\n`;
      css += `  width: ${child.width}px;\n`;
      css += `  height: ${child.height}px;\n`;
      css += `}\n\n`;
    });
  }

  return css;
}

module.exports = {
  generateReactComponent,
  generateChildrenJSX,
  getFillColor,
  generateCSS,
};
