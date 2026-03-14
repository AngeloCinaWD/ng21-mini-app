import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HTTPHEADERREQUEST } from '../helper/httpHeaderRequest';
import { AuthResponse } from '../interface/authResponse';
import { User } from '../interface/user';
import { ApiResponse } from '../interface/apiResponse';
import { LanguageService, Lang } from '../service/language.service';

const TOKEN_KEY = 'auth_token';
const USER_NAME_KEY = 'auth_user_name';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private languageService = inject(LanguageService);

  private bearer_token = signal<string>(
    localStorage.getItem(TOKEN_KEY) ?? sessionStorage.getItem(TOKEN_KEY) ?? '',
  );

  private userName = signal<string>(
    localStorage.getItem(USER_NAME_KEY) ?? sessionStorage.getItem(USER_NAME_KEY) ?? '',
  );

  private currentUser = signal<User | null>(null);

  logged = computed<boolean>(() => this.bearer_token().trim() !== '');

  token = computed<string>(() => this.bearer_token());

  userNamePublic = computed<string>(() => this.userName());

  user = computed<User | null>(() => this.currentUser());

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

  private get headers() {
    return HTTPHEADERREQUEST.set('Authorization', `Bearer ${this.bearer_token()}`);
  }

  login(email: string, password: string, rememberMe: boolean) {
    this.loginError.set('');
    this.http
      .post<AuthResponse>('http://127.0.0.1:8000/api/login', { email, password }, {
        headers: HTTPHEADERREQUEST,
      })
      .subscribe({
        next: (res) => {
          this.setSession(res.data.token, res.data.user.name, rememberMe);
          this.currentUser.set(res.data.user);
          this.applyUserLanguage(res.data.user);
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
          this.currentUser.set(res.data.user);
          this.router.navigate(['/home']);
        },
        error: (err) => {
          const message = err.error?.message ?? 'Errore durante la registrazione';
          this.registerError.set(message);
        },
      });
  }

  loadUser() {
    this.http
      .get<User>('http://127.0.0.1:8000/api/user', { headers: this.headers })
      .subscribe({
        next: (user) => {
          this.currentUser.set(user);
          this.userName.set(user.name);
          this.applyUserLanguage(user);
        },
      });
  }

  updateUser(data: { name?: string; password?: string; password_confirmation?: string; preference?: { language: string } }) {
    return this.http.put<ApiResponse<User>>(
      'http://127.0.0.1:8000/api/user',
      data,
      { headers: this.headers },
    );
  }

  logout() {
    this.http
      .post('http://127.0.0.1:8000/api/logout', {}, { headers: this.headers })
      .subscribe({
        next: () => this.clearSession(),
        error: () => this.clearSession(),
      });
  }

  private applyUserLanguage(user: User) {
    const lang = user.preference?.language as Lang | undefined;
    if (lang) {
      this.languageService.setLanguage(lang);
    }
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
    this.currentUser.set(null);
    this.languageService.setLanguage('it');
    this.router.navigate(['/login']);
  }
}
