import { Injectable } from '@angular/core';
import { RequestService } from './request.service';
import { HttpClient } from '@angular/common/http';
import { API_ROUTES } from '../constants/api-routes.constants';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PostService extends RequestService {
  constructor(private http: HttpClient) {
    super();
  }

  public getAll(): Observable<any> {
    const route = this.createCompleteRoute(API_ROUTES.main.posts.getAll);
    return this.http.get(route);
  }

  public add(postData: string): Observable<any> {
    const route = this.createCompleteRoute(API_ROUTES.main.posts.add);
    return this.http.post(route, { title: postData, userId: 5 });
  }
}
