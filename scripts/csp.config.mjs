// scripts/csp.config.mjs
// Put *all* third-party hosts here. No quotes/commas issues, just arrays.
// You can keep this minimal and add as you grow.

export default {
  // External <script src> hosts (NOT inline hashes)
  scriptSrc: [
    // hCaptcha loader:
    "https://js.hcaptcha.com",
    // GTM/GA (optional):
    "https://www.googletagmanager.com",
    "https://www.google-analytics.com",
  ],

  // Network calls (fetch/xhr/sendBeacon/WebSocket)
  connectSrc: [
    // Web3Forms API:
    "https://api.web3forms.com",
    // hCaptcha:
    "https://hcaptcha.com",
    "https://*.hcaptcha.com",
    // GA/GTM (optional):
    "https://www.google-analytics.com",
    "https://region1.google-analytics.com",
    "https://www.googletagmanager.com",
    // "https://stats.g.doubleclick.net",
  ],

  // Images (pixel beacons, captcha assets)
  imgSrc: [
    "https://hcaptcha.com",
    "https://*.hcaptcha.com",
    // GA pixel (optional):
    "https://www.google-analytics.com",
  ],

  // Iframes (captcha, tag assistant/preview)
  frameSrc: [
    "https://hcaptcha.com",
    "https://*.hcaptcha.com",
    "https://www.googletagmanager.com",
    "https://tagassistant.google.com",
  ],

  // Where forms can POST/redirect
  formAction: ["https://api.web3forms.com"],

  // Keep inline styles allowed? (Astro often needs this)
  styleUnsafeInline: true,

  // Add worker-src 'self' blob: if you use Web Workers or blob URLs
  addWorkerSrc: false,

  // Optional: allow manifest
  addManifestSrc: false,

  // Extra raw directives if you want to append lines yourself
  extraDirectives: [
    // "require-trusted-types-for 'script'",
    // "trusted-types default",
  ],
};
