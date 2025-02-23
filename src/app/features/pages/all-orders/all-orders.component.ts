import { Component } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-all-orders',
  imports: [],
  templateUrl: './all-orders.component.html',
  styleUrl: './all-orders.component.scss'
})
export class AllOrdersComponent {

  ngOnInit(): void {
    if (localStorage.getItem('payment') == 'success') {
      Swal.fire({
        title: "Success",
        text: "Order Created Successfully",
        icon: "success",
        confirmButtonText: "Ok",
        confirmButtonColor: "#14803D",
      })
      localStorage.removeItem('payment');
    }
  }
}
