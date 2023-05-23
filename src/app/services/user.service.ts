import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  url: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  onSignup(data: any) {
    return this.http.post(this.url + '/user/signup', data);
  }

  onLogin(data: any) {
    return this.http.post(this.url + '/user/login', data);
  }
}
