import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <app-google-auth></app-google-auth>
    <router-outlet></router-outlet>
    <app-footer></app-footer>
  `,
})
export class AppComponent {}
