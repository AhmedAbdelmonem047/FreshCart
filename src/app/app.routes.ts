import { MainLayoutComponent } from './features/layout/main-layout/main-layout.component';
import { AuthLayoutComponent } from './features/layout/auth-layout/auth-layout.component';
import { Routes } from '@angular/router';
import { authGuard } from './core/guard/auth/auth.guard';
import { cartGuard } from './core/guard/cart/cart.guard';


export const routes: Routes = [
    {
        path: '', component: MainLayoutComponent, children: [
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'home', loadComponent: () => import('./features/pages/home/home.component').then((c) => c.HomeComponent), title: 'Home' },
            { path: 'productDetails/:productID', loadComponent: () => import('./features/pages/product-details/product-details.component').then((c) => c.ProductDetailsComponent), title: 'Product Details' },
            { path: 'cart', canActivate: [cartGuard], loadComponent: () => import('./features/pages/cart/cart.component').then((c) => c.CartComponent), title: 'Cart' },
            { path: 'wishlist', canActivate: [cartGuard], loadComponent: () => import('./features/pages/wishlist/wishlist.component').then((c) => c.WishlistComponent), title: 'Wishlist' },
            { path: 'allorders', canActivate: [cartGuard], loadComponent: () => import('./features/pages/all-orders/all-orders.component').then((c) => c.AllOrdersComponent), title: 'All Orders' },
            { path: 'checkout/:cartId', canActivate: [cartGuard], loadComponent: () => import('./features/pages/checkout/checkout.component').then((c) => c.CheckoutComponent), title: 'Checkout' },
            { path: 'brands', loadComponent: () => import('./features/pages/brands/brands.component').then((c) => c.BrandsComponent), title: 'Brands' },
            { path: 'products', loadComponent: () => import('./features/pages/products/products.component').then((c) => c.ProductsComponent), title: 'Products' },
            { path: 'categories', loadComponent: () => import('./features/pages/categories/categories.component').then((c) => c.CategoriesComponent), title: 'Categories' },
            { path: 'subCategory/:catID', loadComponent: () => import('./features/pages/sub-category/sub-category.component').then((c) => c.SubCategoryComponent), title: 'Sub Categories' },
        ]
    },
    {
        path: '', component: AuthLayoutComponent, canActivate: [authGuard], children: [
            { path: '', redirectTo: 'login', pathMatch: 'full' },
            { path: 'login', loadComponent: () => import('./features/auth/login/login.component').then((c) => c.LoginComponent), title: 'Login' },
            { path: 'signup', loadComponent: () => import('./features/auth/signup/signup.component').then((c) => c.SignupComponent), title: 'Signup' },
            { path: 'resetPassword', loadComponent: () => import('./features/auth/reset-password/reset-password.component').then((c) => c.ResetPasswordComponent), title: 'Reset Password' },

        ]
    },
    { path: '**', loadComponent: () => import('./features/pages/not-found/not-found.component').then((c) => c.NotFoundComponent), title: '404' },
];
