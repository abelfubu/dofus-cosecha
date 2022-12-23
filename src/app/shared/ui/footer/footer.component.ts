import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: ` <footer>email: abelfubu@gmail.com</footer> `,
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {}
