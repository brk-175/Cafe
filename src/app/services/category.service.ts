import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  url: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAllCategories() {
    return this.http.get(this.url + '/category/all');
  }

  addCategory(data: any) {
    return this.http.post(this.url + '/category/add', data);
  }

  updateCategory(data: any) {
    return this.http.post(this.url + '/category/update', data);
  }
}
