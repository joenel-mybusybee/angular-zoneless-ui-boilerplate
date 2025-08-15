import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RequestService {
  private envAddress = environment.apiUrl;

  protected createCompleteRoute = (route: string) => {
    return `${this.envAddress}/${route}`;
  };
}
