import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { GlobalStore } from 'src/app/shared/store/global.store';
import { ButtonComponent } from 'src/app/shared/ui/button/button.component';
import { InputComponent } from 'src/app/shared/ui/input/input.component';
import { AuthProvider } from '../../shared/models/auth-provider';
import { GOOGLE_BUTTON_CONFIG } from './login-data';

declare var google: GoogleAuth;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, InputComponent, ButtonComponent, RouterModule],
})
export class LoginComponent implements OnInit {
  @ViewChild('googleButton', { read: ElementRef, static: true })
  private googleButton!: ElementRef<HTMLDivElement>;

  private readonly globalStore = inject(GlobalStore);
  private readonly formBuilder = inject(FormBuilder);

  form = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/),
      ],
    ],
  });

  ngOnInit(): void {
    this.renderGoogleButton();
  }

  onLoginSubmit() {
    if (this.form.invalid) return;

    this.globalStore.login({
      provider: AuthProvider.EMAIL,
      email: String(this.form.value.email),
      password: String(this.form.value.password),
    });
  }

  private renderGoogleButton() {
    google.accounts.id.renderButton(
      this.googleButton.nativeElement,
      GOOGLE_BUTTON_CONFIG,
    );
  }
}
