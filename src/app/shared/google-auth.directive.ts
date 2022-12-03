import { Directive, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthProvider } from './models/auth-provider';
import { LoginService } from './services/login.service';

declare var google: GoogleAuth;

@Directive({
  selector: 'app-google-auth',
})
export class GoogleAuthDirective implements OnInit {
  constructor(
    private readonly renderer: Renderer2,
    private readonly elementRef: ElementRef,
    private readonly loginService: LoginService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    const script: HTMLScriptElement = this.renderer.createElement('script');
    this.renderer.setAttribute(
      script,
      'src',
      'https://accounts.google.com/gsi/client'
    );
    script.onload = this.initializeGoogleAuth.bind(this);
    this.renderer.appendChild(this.elementRef.nativeElement, script);
  }

  initializeGoogleAuth(): void {
    google.accounts.id.initialize({
      client_id: environment.googleClientId,
      callback: this.onGoogleLogin.bind(this),
    });

    google.accounts.id.prompt();
  }

  onGoogleLogin({ credential }: GoogleAuthResponse): void {
    this.loginService
      .login({ provider: AuthProvider.GOOGLE, credential })
      .subscribe(() => {
        this.router.navigate(['/']);
      });
  }
}
