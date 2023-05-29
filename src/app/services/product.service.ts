import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  url: string = environment.apiUrl;
  constructor(private http: HttpClient) {}

  addProduct(data: any) {
    return this.http.post(this.url + '/product/add', data);
  }

  getAllProducts() {
    return this.http.get(this.url + '/product/all');
  }

  updateProduct(data: any) {
    return this.http.post(this.url + '/product/update', data);
  }

  deleteProduct(id: any) {
    return this.http.get(this.url + '/product/delete/' + id);
  }

  changeProductStatus(data: any) {
    return this.http.post(this.url + '/product/updateStatus', data);
  }

  getProductById(id: any) {
    return this.http.get(this.url + '/product/getProductById/' + id);
  }

  getProductByCategory(id: any) {
    return this.http.get(this.url + '/product/getByCategory/' + id);
  }
}
