import { CartService } from './../../../core/services/cart/cart.service';
import { AuthService } from './../../../core/services/auth/auth.service';
import { Component } from '@angular/core';
import { FlowbiteService } from '../../../core/services/flowbite/flowbite.service';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  isLoggedIn: boolean = false;
  cartTotalItems!: number;

  constructor(private flowbiteService: FlowbiteService, private _AuthService: AuthService, private _CartService: CartService) {
    _CartService.cartTotalItems.subscribe({
      next:(res) =>{
        this.cartTotalItems = res;
      }
    })
  }

  ngOnInit(): void {
    this._AuthService?.userData.subscribe({
      next: (res) => {
        if (res !== null)
          this.isLoggedIn = true;
        else
          this.isLoggedIn = false
      }
    })

    this.flowbiteService.loadFlowbite(flowbite => {
      console.log('Flowbite loaded', flowbite);
    });
  }

  getLogoutFn() {
    this._AuthService.logout();
  }
}
