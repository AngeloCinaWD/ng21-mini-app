import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HTTPHEADERREQUEST } from '../helper/httpHeaderRequest';

const TOKEN_KEY = 'auth_token';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private bearer_token = signal<string>(localStorage.getItem(TOKEN_KEY) ?? '');

  logged = computed<boolean>(() => this.bearer_token().trim() !== '');

  token = computed<string>(() => this.bearer_token());

  login(email: string, password: string) {
    this.http
      .post<{ data: { token: string } }>(
        'http://127.0.0.1:8000/api/login',
        { email, password },
        { headers: HTTPHEADERREQUEST },
      )
      .subscribe({
        next: (res) => {
          const token = res.data.token;
          localStorage.setItem(TOKEN_KEY, token);
          this.bearer_token.set(token);
          this.router.navigate(['/home']);
        },
        error: () => {
          this.loginError.set('Email o password non validi');
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

  loginError = signal<string>('');

  private clearSession() {
    localStorage.removeItem(TOKEN_KEY);
    this.bearer_token.set('');
    this.router.navigate(['/login']);
  }
}
