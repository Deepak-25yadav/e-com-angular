import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { ToastrModule } from 'ngx-toastr';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';


import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AdminNavbarComponent } from './components/admin-navbar/admin-navbar.component';
import { HomeComponent } from './pages/home/home.component';
import { CartComponent } from './pages/cart/cart.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { OrderHistoryComponent } from './pages/order-history/order-history.component';
import { AdminOrderHistoryComponent } from './pages/admin-order-history/admin-order-history.component';
import { AllProductsComponent } from './pages/all-products/all-products.component';
import { CreateProductComponent } from './pages/create-product/create-product.component';
import { PaymentSuccessComponent } from './pages/payment-success/payment-success.component';
import { FormsModule } from '@angular/forms';
import { AddAddressComponent } from './pages/add-address/add-address.component';
import { PaymentFailureComponent } from './pages/payment-failure/payment-failure.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { EditProductComponent } from './pages/edit-product/edit-product.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    AdminNavbarComponent,
    HomeComponent,
    CartComponent,
    LoginComponent,
    SignupComponent,
    OrderHistoryComponent,
    AdminOrderHistoryComponent,
    AllProductsComponent,
    CreateProductComponent,
    PaymentSuccessComponent,
    AddAddressComponent,
    PaymentFailureComponent,
    EditProductComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    SweetAlert2Module.forRoot(),
    FormsModule,
    MatSnackBarModule,
    // ToastrModule.forRoot() // For toast notifications
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
