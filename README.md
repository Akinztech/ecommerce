# Forma Home

A responsive storefront for considered home textiles and decor, built with React, TypeScript, and Vite.

## Features

- Product catalog with category filters and search
- Saved products, product details, and a cart drawer
- Design consultation, journal, and newsletter sections
- Responsive layouts for desktop and mobile

## Local development

```sh
npm install
npm run dev
```

Run `npm run build` to create a production build and `npm run lint` to check the code.

## Deployment

The GitHub Actions workflow builds pull requests and deploys the production build to GitHub Pages whenever changes are pushed to `main`. The Vite base path is configured for the `/ecommerce/` project site.

Product content and contact details are demonstration values. Checkout, payment processing, inventory, order tracking, and newsletter delivery require backend integration.
