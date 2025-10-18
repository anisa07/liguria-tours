# Images Directory

This directory contains static images for the site.

## Required Images

### Open Graph Image (`og-image.jpg`)

- **Dimensions**: 1200x630px (recommended)
- **Format**: JPG or PNG
- **Purpose**: Social media sharing preview
- **Location**: `/public/images/og-image.jpg`

The Open Graph image is referenced in `src/config/siteData.json` and will be displayed when your site is shared on social media platforms like Facebook, Twitter, LinkedIn, etc.

### Favicon

The main favicon is located at `/public/favicon.svg` (already exists).

## Adding Images

1. Place images in this directory
2. Reference them from the root: `/images/your-image.jpg`
3. Update `siteData.json` if you change the Open Graph image name
