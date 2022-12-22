import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <app-google-auth></app-google-auth>
    <router-outlet></router-outlet>
  `,
})
export class AppComponent {}
