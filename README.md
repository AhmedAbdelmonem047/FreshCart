# FreshCart — E-Commerce Frontend

FreshCart is a responsive e-commerce storefront built with **Angular 19, TypeScript, and Tailwind CSS**. It includes product browsing, category pages, product details, account screens, and shopping-related routes.

**Live demo:** [fresh-cart-livid-omega.vercel.app](https://fresh-cart-livid-omega.vercel.app)  
**Repository:** [AhmedAbdelmonem047/FreshCart](https://github.com/AhmedAbdelmonem047/FreshCart)

## Features

- **Storefront:** home page with home and category sliders, product listings, and shared layout components
- **Product discovery:** products, brands, categories, subcategories, and product details
- **Shopping flows:** cart, wishlist, checkout, and order-history routes
- **Account screens:** login, signup, and password-reset pages
- **Navigation:** Angular Router with lazy-loaded page components and route guards
- **User feedback and presentation:** loading spinner, SweetAlert2 dialogs, and Lottie animations
- **Responsive styling:** Tailwind CSS and Flowbite

Some shopping and account workflows are guarded by application route guards. The actual data and authentication behaviour depend on the service/API configuration in the project.

## Tech Stack

| Area | Technologies |
|---|---|
| Framework | Angular 19, standalone components |
| Language | TypeScript |
| Routing and state/events | Angular Router, RxJS |
| Styling | Tailwind CSS, Flowbite, SCSS |
| UI libraries | SweetAlert2, Font Awesome |
| Animation and carousels | Lottie, `ngx-lottie`, `ngx-owl-carousel-o` |
| Loading indicator | `ngx-spinner` |
| Build and tests | Angular CLI, Jasmine, Karma |
| Rendering support | Angular SSR packages are configured in the project |

## Live Demo

Visit the deployed application: **[Open FreshCart](https://fresh-cart-livid-omega.vercel.app)**.

## Getting Started

### Prerequisites

- Node.js and npm versions compatible with the Angular 19 toolchain
- A modern browser

### Install and run

```bash
git clone https://github.com/AhmedAbdelmonem047/FreshCart.git
cd FreshCart
npm install
npm start
```

Open `http://localhost:4200/` in your browser. The Angular development server supports live reload while editing source files.

## Available Scripts

```bash
# Start the development server
npm start

# Build the application
npm run build

# Rebuild in development watch mode
npm run watch

# Run the configured unit-test runner
npm test
```

The project also defines an SSR serving script, `npm run serve:ssr:ecommerce`, which expects the corresponding server bundle to have been generated. Run and verify the build locally before using that command.

## Application Routes

| Route | Purpose |
|---|---|
| `/home` | Storefront home page |
| `/products` | Product listing |
| `/productDetails/:productID` | Product details |
| `/brands` | Brand listing |
| `/categories` | Category listing |
| `/subCategory/:catID` | Subcategory listing |
| `/cart` | Shopping cart |
| `/wishlist` | Wishlist |
| `/checkout/:cartId` | Checkout flow |
| `/allorders` | Order history |
| `/login` | Login page |
| `/signup` | Registration page |
| `/resetPassword` | Password-reset page |

Routes and behaviour may depend on the guards and services configured in the application. Refer to `src/app/app.routes.ts` for the current routing configuration.

## Build

```bash
npm run build
```

Angular writes build output to the configured `dist/` directory. Review the Angular CLI configuration if you need to change output paths or the rendering mode.

## Project Status

This is a frontend portfolio project. It demonstrates component-based UI development, routing, responsive styling, and e-commerce navigation flows. It should be evaluated as a frontend application; it is not a standalone backend service.
