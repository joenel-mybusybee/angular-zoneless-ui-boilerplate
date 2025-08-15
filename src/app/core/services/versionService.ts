import { Injectable } from '@angular/core';
import { version } from '../../../../package.json';

@Injectable({
  providedIn: 'root',
})
export class VersionService {
  private readonly version: string = version;

  getVersion(): string {
    return this.version;
  }
}
