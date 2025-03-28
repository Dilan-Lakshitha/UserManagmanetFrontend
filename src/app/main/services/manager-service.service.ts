import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../shared/models/user';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../enviroment/enviroment';

@Injectable({
  providedIn: 'root'
})
export class ManagerServiceService {
  private baseUrl = environment.apiUrl;

  constructor(private http:HttpClient) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl + '/user/getAllUsers');
  }

      
  deleteUser(UserId: any): Observable<any> {
    return this.http.delete(this.baseUrl + `/user/delete/${UserId}`);
  }
}
