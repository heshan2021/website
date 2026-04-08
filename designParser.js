/**
 * Figma Design Parser
 * Extracts and parses Figma design data into a structured format
 */

/**
 * Parse Figma file to extract components, frames, and styles
 * @param {object} figmaFile - The complete Figma file object
 * @returns {object} - Parsed design data
 */
function parseDesignData(figmaFile) {
  const designs = {
    pages: [],
    components: {},
    colors: new Set(),
    typography: new Set(),
  };

  if (!figmaFile.document || !figmaFile.document.children) {
    return designs;
  }

  // Extract pages
  figmaFile.document.children.forEach(page => {
    designs.pages.push({
      id: page.id,
      name: page.name,
      frames: extractFrames(page),
    });
  });

  return designs;
}

/**
 * Extract frames from a page
 * @param {object} node - Figma node
 * @returns {array} - Array of frame objects
 */
function extractFrames(node) {
  const frames = [];

  if (node.children) {
    node.children.forEach(child => {
      if (child.type === 'FRAME' || child.type === 'COMPONENT') {
        frames.push({
          id: child.id,
          name: child.name,
          type: child.type,
          width: child.absoluteBoundingBox?.width || 0,
          height: child.absoluteBoundingBox?.height || 0,
          x: child.absoluteBoundingBox?.x || 0,
          y: child.absoluteBoundingBox?.y || 0,
          children: extractChildren(child),
        });
      }
    });
  }

  return frames;
}

/**
 * Extract children elements
 * @param {object} node - Figma node
 * @returns {array} - Array of child elements
 */
function extractChildren(node) {
  const children = [];

  if (node.children) {
    node.children.forEach(child => {
      children.push({
        id: child.id,
        name: child.name,
        type: child.type,
        width: child.absoluteBoundingBox?.width || 0,
        height: child.absoluteBoundingBox?.height || 0,
        fills: child.fills || [],
        text: child.characters || null,
      });
    });
  }

  return children;
}

module.exports = {
  parseDesignData,
  extractFrames,
  extractChildren,
};
