/**
 * Figma API Authentication Module
 * Handles authentication and basic API calls to Figma
 */

require('dotenv').config();

const FIGMA_API_URL = 'https://api.figma.com/v1';
const FIGMA_TOKEN = process.env.FIGMA_TOKEN;

// Validate token on startup
if (!FIGMA_TOKEN) {
  console.error('ERROR: FIGMA_TOKEN is not set in .env file');
  console.error('Please follow the setup instructions in README.md');
  process.exit(1);
}

/**
 * Make authenticated requests to Figma API
 * @param {string} endpoint - API endpoint (e.g., '/files/{file_key}')
 * @param {object} options - Fetch options
 * @returns {Promise<object>} - API response
 */
async function fetchFromFigma(endpoint, options = {}) {
  const url = `${FIGMA_API_URL}${endpoint}`;
  
  const config = {
    ...options,
    headers: {
      'X-FIGMA-TOKEN': FIGMA_TOKEN,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorBody = await response.text();
      if (response.status === 401) {
        throw new Error('Authentication failed: Invalid or expired Figma token');
      } else if (response.status === 404) {
        throw new Error('Not found: File or resource does not exist');
      } else if (response.status === 400) {
        throw new Error(`Bad Request (400): ${errorBody || 'Invalid file ID or parameters'}`);
      }
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Figma API Error: ${error.message}`);
    throw error;
  }
}

/**
 * Get file data from Figma
 * @param {string} fileId - Figma file ID
 * @returns {Promise<object>} - File data
 */
async function getFile(fileId) {
  try {
    console.log(`  Fetching file with ID: ${fileId}`);
    const data = await fetchFromFigma(`/files/${fileId}`);
    console.log(`✓ Successfully retrieved Figma file: ${data.name}`);
    return data;
  } catch (error) {
    console.error('Failed to retrieve file:', error.message);
    
    // Additional debugging for 400 errors
    if (error.message.includes('400')) {
      console.error('\n💡 File ID troubleshooting:');
      console.error('   - Make sure your file ID is correct');
      console.error('   - File IDs from URLs look like: yVd4vkL60C9xvRfV1qTUTK');
      console.error('   - Do NOT include the filename or query parameters');
      console.error('   - Example: figma.com/file/yVd4vkL60C9xvRfV1qTUTK/filename');
    }
    throw error;
  }
}

/**
 * Get file nodes from Figma
 * @param {string} fileId - Figma file ID
 * @param {array} nodeIds - Node IDs to retrieve
 * @returns {Promise<object>} - Node data
 */
async function getFileNodes(fileId, nodeIds = []) {
  try {
    const params = nodeIds.length > 0 
      ? `?ids=${nodeIds.join(',')}`
      : '';
    const data = await fetchFromFigma(`/files/${fileId}/nodes${params}`);
    return data;
  } catch (error) {
    console.error('Failed to retrieve nodes:', error.message);
    throw error;
  }
}

/**
 * Get user information
 * @returns {Promise<object>} - User data
 */
async function getUser() {
  try {
    const data = await fetchFromFigma('/me');
    console.log(`✓ Authenticated as: ${data.email}`);
    return data;
  } catch (error) {
    console.error('Failed to authenticate:', error.message);
    throw error;
  }
}

/**
 * Test Figma authentication
 * @returns {Promise<boolean>} - True if authenticated successfully
 */
async function testAuth() {
  try {
    await getUser();
    return true;
  } catch (error) {
    return false;
  }
}

module.exports = {
  fetchFromFigma,
  getFile,
  getFileNodes,
  getUser,
  testAuth,
};
