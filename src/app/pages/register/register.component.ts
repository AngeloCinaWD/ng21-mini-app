import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  FormField,
  form,
  required,
  email,
  minLength,
  validate,
  requiredError,
} from '@angular/forms/signals';
import { AuthService } from '../../service/auth.service';
import { LanguageService } from '../../service/language.service';

@Component({
  selector: 'app-register',
  imports: [FormField, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  authService = inject(AuthService);
  lang = inject(LanguageService);

  registerModel = signal({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  registerForm = form(this.registerModel, (f) => {
    required(f.name);
    required(f.email);
    email(f.email);
    required(f.password);
    minLength(f.password, 8);
    required(f.confirmPassword);
    validate(f.confirmPassword, ({ value, valueOf }) => {
      if (value() !== valueOf(f.password)) {
        return requiredError({ message: '' });
      }
      return undefined;
    });
  });

  showPassword = signal(false);
  showConfirmPassword = signal(false);

  togglePassword() {
    this.showPassword.update((v) => !v);
  }

  toggleConfirmPassword() {
    this.showConfirmPassword.update((v) => !v);
  }

  onSubmit(event: Event) {
    event.preventDefault();
    if (this.registerForm().invalid()) {
      return;
    }
    const { name, email, password, confirmPassword } = this.registerModel();
    this.authService.register(name, email, password, confirmPassword);
  }
}
