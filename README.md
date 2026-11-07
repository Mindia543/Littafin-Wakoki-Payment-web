# Glorious Path support page

Static, responsive support page for GitHub Pages or another static host. It has no payment provider integration and does not collect or transmit payment credentials.

## Publish with GitHub Pages

This folder is self-contained and can be used as the root of the dedicated `Littafin-Wakoki-Payment-web` repository. The workflow in `.github/workflows/pages.yml` deploys the repository root to GitHub Pages when a commit reaches `main`.

After the first push, open repository **Settings → Pages** and choose **GitHub Actions** if GitHub has not enabled it automatically. The deployment summary and Pages settings show the public HTTPS URL.

The page offers suggested amounts and validates custom amounts locally. The minimum accepted amount is ₦100; the page does not display that threshold. Where a verified direct transfer format is available, the page requests the phone dialer to open it with the selected amount and the ministry's receiving account prefilled. Other selected banks open their general USSD menu, where the donor must complete the transfer details. A browser cannot place a USSD call silently or enter a banking PIN. The donor must review and authorize the transfer in the bank flow. Device/browser support for `tel:` links varies, especially on desktop and iOS.

The codes in `script.js` are entry codes, not guaranteed prefilled donation transfers. OPay and PalmPay options are included as USSD entry points; availability and transfer flow can depend on the user's account and SIM. Verify each provider's current customer instructions before production use.
