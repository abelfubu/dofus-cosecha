import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GlobalStore } from '../../store/global.store';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [CommonModule, ButtonComponent, RouterModule],
})
export class HeaderComponent {
  isLoggedIn$ = this.globalStore.isLoggedIn$;
  @Output() logout = new EventEmitter();

  constructor(private readonly globalStore: GlobalStore) {}
}
