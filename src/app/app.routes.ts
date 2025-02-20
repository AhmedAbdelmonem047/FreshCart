import { MainLayoutComponent } from './features/layout/main-layout/main-layout.component';
import { SignupComponent } from './features/auth/signup/signup.component';
import { LoginComponent } from './features/auth/login/login.component';
import { AuthLayoutComponent } from './features/layout/auth-layout/auth-layout.component';
import { Routes } from '@angular/router';
import { HomeComponent } from './features/pages/home/home.component';
import { CartComponent } from './features/pages/cart/cart.component';
import { ProductsComponent } from './features/pages/products/products.component';
import { BrandsComponent } from './features/pages/brands/brands.component';
import { CategoriesComponent } from './features/pages/categories/categories.component';
import { NotFoundComponent } from './features/pages/not-found/not-found.component';
import { authGuard } from './core/guard/auth/auth.guard';
import { cartGuard } from './core/guard/cart/cart.guard';
import { ProductDetailsComponent } from './features/pages/product-details/product-details.component';
import { AllOrdersComponent } from './features/pages/all-orders/all-orders.component';
import { CheckoutComponent } from './features/pages/checkout/checkout.component';
import { WishlistComponent } from './features/pages/wishlist/wishlist.component';

export const routes: Routes = [
    {
        path: '', component: MainLayoutComponent, children: [
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'home', component: HomeComponent, title: 'Home' },
            { path: 'productDetails/:productID', component: ProductDetailsComponent, title: 'Product Details' },
            { path: 'cart', component: CartComponent, canActivate: [cartGuard], title: 'Cart' },
            { path: 'wishlist', component: WishlistComponent, canActivate: [cartGuard], title: 'Wishlist' },
            { path: 'allorders', component: AllOrdersComponent, canActivate: [cartGuard], title: 'All Orders' },
            { path: 'checkout/:cartId', component: CheckoutComponent, canActivate: [cartGuard], title: 'Checkout' },
            { path: 'brands', component: BrandsComponent, title: 'Brands' },
            { path: 'products', component: ProductsComponent, title: 'Products' },
            { path: 'categories', component: CategoriesComponent, title: 'Categories' },
        ]
    },
    {
        path: '', component: AuthLayoutComponent, canActivate: [authGuard], children: [
            { path: '', redirectTo: 'login', pathMatch: 'full' },
            { path: 'login', component: LoginComponent, title: 'Login' },
            { path: 'signup', component: SignupComponent, title: 'Signup' }
        ]
    },
    { path: '**', component: NotFoundComponent, title: '404' }
];
