import {
  Directive,
  ElementRef,
  NgZone,
  OnInit,
  Renderer2,
} from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthProvider } from './models/auth-provider';
import { GlobalStore } from './store/global.store';

declare var google: GoogleAuth;

@Directive({
  selector: 'app-google-auth',
})
export class GoogleAuthDirective implements OnInit {
  constructor(
    private readonly ngZone: NgZone,
    private readonly renderer: Renderer2,
    private readonly elementRef: ElementRef,
    private readonly globalStore: GlobalStore
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
      callback: (res) => this.ngZone.run(this.onGoogleLogin, this, [res]),
    });

    // google.accounts.id.prompt();
  }

  onGoogleLogin({ credential }: GoogleAuthResponse): void {
    this.globalStore.login({ provider: AuthProvider.GOOGLE, credential });
  }
}
