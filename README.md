# Figma-to-Code

Convert your Figma designs to code. This tool uses the Figma API to export design data and generate code.

## Prerequisites

- Node.js 14+ installed
- A Figma account
- A Figma file to work with

## Setup Instructions

### 1. Get Your Figma Personal Access Token

1. Go to [Figma Settings → Tokens](https://www.figma.com/developers/api#auth-token)
2. Click "Create a new token"
3. Give it a name (e.g., "Figma-to-Code")
4. Copy the token (you won't be able to see it again!)

### 2. Get Your Figma File ID

1. Open your Figma file in the browser
2. Copy the File ID from the URL: `figma.com/file/{FILE_ID}/...`

### 3. Configure Your Project

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your credentials:
   ```
   FIGMA_TOKEN=your_token_here
   FIGMA_FILE_ID=your_file_id_here
   ```

### 4. Install Dependencies

```bash
npm install
```

### 5. Test Authentication

```bash
npm start
```

You should see output confirming your authentication is working.

## Project Structure

```
.
├── package.json          # Project dependencies
├── .env.example          # Example environment variables
├── .gitignore            # Git ignore rules
├── index.js              # Main entry point
├── figmaAuth.js          # Figma API authentication module
└── README.md             # This file
```

## Available Functions

### `figmaAuth.getUser()`
Returns authenticated user information.

### `figmaAuth.getFile(fileId)`
Fetch complete file data including all pages, frames, and components.

### `figmaAuth.getFileNodes(fileId, nodeIds)`
Fetch specific nodes from a file.

### `figmaAuth.testAuth()`
Test if your token is valid.

## API Documentation

For detailed information about the Figma API, visit:
https://www.figma.com/developers/api

## Common Issues

### "Authentication failed: Invalid or expired Figma token"
- Check that your FIGMA_TOKEN in `.env` is correct
- Make sure you copied the full token
- Token may have expired; generate a new one

### "Not found: File or resource does not exist"
- Double-check your FIGMA_FILE_ID is correct
- Make sure you have access to the file

### "Invalid FIGMA_FILE_ID"
- Extract FILE_ID from: `figma.com/file/{FILE_ID}/filename`
- Don't include the filename or version number

## Next Steps

1. Explore the [Figma API documentation](https://www.figma.com/developers/api)
2. Parse the design data for code generation
3. Implement your code generator (React, HTML/CSS, etc.)
4. Add style extraction and component mapping

## License

MIT
