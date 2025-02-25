import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'productDetails/:productID',
    renderMode: RenderMode.Server
  },
  {
    path: 'checkout/:cartId',
    renderMode: RenderMode.Server
  },
  {
    path: 'subCategory/:catID',
    renderMode: RenderMode.Server
  }
];
