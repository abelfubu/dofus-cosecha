import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  template: `
    <app-google-auth></app-google-auth>
    <router-outlet></router-outlet>
  `,
})
export class AppComponent {
  constructor(private router: Router) {
    const path = localStorage.getItem('path');

    if (path) {
      localStorage.removeItem('path');
      this.router.navigate([path]);
    }
  }
}
