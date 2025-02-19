import { Pipe, PipeTransform } from '@angular/core';
import { Products } from '../interfaces/products/products';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(productList: Products[], searchVal: string): Products[] {
    return productList.filter((product)=>{
      return product.title.toUpperCase().includes(searchVal.toUpperCase());
    });
  }

}
