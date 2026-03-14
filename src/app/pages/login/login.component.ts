import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormField, form, required, email } from '@angular/forms/signals';
import { AuthService } from '../../service/auth.service';
import { LanguageService } from '../../service/language.service';

@Component({
  selector: 'app-login',
  imports: [FormField, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  authService = inject(AuthService);
  lang = inject(LanguageService);

  loginModel = signal({ email: '', password: '', rememberMe: false });

  loginForm = form(this.loginModel, (f) => {
    required(f.email);
    email(f.email);
    required(f.password);
  });

  showPassword = signal(false);

  togglePassword() {
    this.showPassword.update((v) => !v);
  }

  onSubmit(event: Event) {
    event.preventDefault();
    if (this.loginForm().invalid()) {
      return;
    }
    const { email, password, rememberMe } = this.loginModel();
    this.authService.login(email, password, rememberMe);
  }
}
