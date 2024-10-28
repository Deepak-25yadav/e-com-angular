import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CartComponent } from './pages/cart/cart.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { OrderHistoryComponent } from './pages/order-history/order-history.component';
import { AdminOrderHistoryComponent } from './pages/admin-order-history/admin-order-history.component';
import { AllProductsComponent } from './pages/all-products/all-products.component';
import { CreateProductComponent } from './pages/create-product/create-product.component';
import { authGuard } from './auth/auth.guard';
import { PaymentSuccessComponent } from './pages/payment-success/payment-success.component';
import { PaymentFailureComponent } from './pages/payment-failure/payment-failure.component';
import { AddAddressComponent } from './pages/add-address/add-address.component';
import { EditProductComponent } from './pages/edit-product/edit-product.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'cart', component: CartComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  {
    path: 'order-history',
    component: OrderHistoryComponent,
    canActivate: [authGuard],
    data: { role: 'user' }
  },
  {
    path: 'admin-order-history',
    component: AdminOrderHistoryComponent,
    canActivate: [authGuard],
    data: { role: 'admin' }
  },
  {
    path: 'all-products',
    component: AllProductsComponent,
    canActivate: [authGuard],
    data: { role: 'admin' }
  },
  {
    path: 'create-product',
    component: CreateProductComponent,
    canActivate: [authGuard],
    data: { role: 'admin' }
  },
  { path: 'add-address', component: AddAddressComponent, canActivate: [authGuard], data: { role: 'user' } },
  { path: 'success', component: PaymentSuccessComponent, canActivate: [authGuard] },
  { path: 'cancel', component: PaymentFailureComponent, canActivate: [authGuard] },
  { path: 'edit-product/:id', component: EditProductComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
