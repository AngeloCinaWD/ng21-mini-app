import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HTTPHEADERREQUEST } from '../helper/httpHeaderRequest';
import { AuthResponse } from '../interface/authResponse';

const TOKEN_KEY = 'auth_token';
const USER_NAME_KEY = 'auth_user_name';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private bearer_token = signal<string>(
    localStorage.getItem(TOKEN_KEY) ?? sessionStorage.getItem(TOKEN_KEY) ?? '',
  );

  private userName = signal<string>(
    localStorage.getItem(USER_NAME_KEY) ?? sessionStorage.getItem(USER_NAME_KEY) ?? '',
  );

  logged = computed<boolean>(() => this.bearer_token().trim() !== '');

  token = computed<string>(() => this.bearer_token());

  userNamePublic = computed<string>(() => this.userName());

  userInitials = computed<string>(() => {
    const name = this.userName().trim();
    if (!name) return '';
    return name
      .split(/\s+/)
      .map((word) => word[0].toUpperCase())
      .join('');
  });

  loginError = signal<string>('');
  registerError = signal<string>('');

  login(email: string, password: string, rememberMe: boolean) {
    this.loginError.set('');
    this.http
      .post<AuthResponse>('http://127.0.0.1:8000/api/login', { email, password }, {
        headers: HTTPHEADERREQUEST,
      })
      .subscribe({
        next: (res) => {
          this.setSession(res.data.token, res.data.user.name, rememberMe);
          this.router.navigate(['/home']);
        },
        error: () => {
          this.loginError.set('Email o password non validi');
        },
      });
  }

  register(name: string, email: string, password: string, password_confirmation: string) {
    this.registerError.set('');
    this.http
      .post<AuthResponse>(
        'http://127.0.0.1:8000/api/register',
        { name, email, password, password_confirmation },
        { headers: HTTPHEADERREQUEST },
      )
      .subscribe({
        next: (res) => {
          this.setSession(res.data.token, res.data.user.name, false);
          this.router.navigate(['/home']);
        },
        error: (err) => {
          const message = err.error?.message ?? 'Errore durante la registrazione';
          this.registerError.set(message);
        },
      });
  }

  logout() {
    this.http
      .post('http://127.0.0.1:8000/api/logout', {}, {
        headers: HTTPHEADERREQUEST.set('Authorization', `Bearer ${this.bearer_token()}`),
      })
      .subscribe({
        next: () => this.clearSession(),
        error: () => this.clearSession(),
      });
  }

  private setSession(token: string, name: string, rememberMe: boolean) {
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem(TOKEN_KEY, token);
    storage.setItem(USER_NAME_KEY, name);
    this.bearer_token.set(token);
    this.userName.set(name);
  }

  private clearSession() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_NAME_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_NAME_KEY);
    this.bearer_token.set('');
    this.userName.set('');
    this.router.navigate(['/login']);
  }
}
