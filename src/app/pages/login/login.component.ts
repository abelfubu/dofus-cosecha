import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';
import { GlobalStore } from 'src/app/shared/store/global.store';
import { ButtonComponent } from 'src/app/shared/ui/button/button.component';
import { InputComponent } from 'src/app/shared/ui/input/input.component';
import { AuthProvider } from '../../shared/models/auth-provider';

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
  private googleButton!: ElementRef;

  form = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(
          /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/
        ),
      ],
    ],
  });

  constructor(
    private readonly router: Router,
    private readonly globalStore: GlobalStore,
    private readonly formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.renderGoogleButton();
    this.globalStore.isLoggedIn$.pipe(filter((x) => x)).subscribe(() => {
      this.router.navigate(['/']);
    });
  }

  private renderGoogleButton() {
    google.accounts.id.renderButton(this.googleButton.nativeElement, {
      theme: 'filled_blue',
      size: 'large',
      width: '500px',
      logo_alignment: 'center',
      shape: 'rectangular',
      type: 'standard',
      text: 'continue_with',
    });
  }

  onLoginSubmit() {
    if (this.form.invalid) return;

    this.globalStore.login({
      provider: AuthProvider.EMAIL,
      email: String(this.form.value.email),
      password: String(this.form.value.password),
    });
  }
}
