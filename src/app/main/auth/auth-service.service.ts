import { Injectable } from '@angular/core';
import { environment } from '../../../enviroment/enviroment';
import { HttpClient } from '@angular/common/http';
import { User } from '../shared/models/user';
import { UserLogin } from '../shared/models/userLogin';
import { map, Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { UserUpdate } from '../shared/models/userUpdate';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  private baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  userRegister(register: User) {
    return this.http.post(this.baseUrl + '/user/UserRegister', register);
  }

  userLogin(login: UserLogin) {
    return this.http.post(this.baseUrl + '/user/UserLogin', login).pipe(
      tap((response: any) => {
        console.log(response);
        if (response) {
          localStorage.setItem('token', response.token);
        }
        return response;
      })
    );
  }

  updateUser(userId: number, user: UserUpdate): Observable<any> {
    return this.http.put(`${this.baseUrl}/user/update/${userId}`, user);
  }

  imageUpload(userId: number, imageNumber: number, formData: FormData) {
    return this.http.post(
      `${this.baseUrl}/userPhoto/upload/${userId}/${imageNumber}`,
      formData
    );
  }

  getUserImages(userId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/userPhoto/${userId}/images`);
  }
  

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    try {
      const decodedToken: any = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);
      return decodedToken.exp < currentTime;
    } catch (error) {
      return true;
    }
  }

  isAuthenticated(): boolean {
    return !this.isTokenExpired();
  }

  logout() {
    localStorage.removeItem('token');
  }
}
