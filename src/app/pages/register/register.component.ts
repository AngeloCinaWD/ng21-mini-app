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

@Component({
  selector: 'app-register',
  imports: [FormField, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  authService = inject(AuthService);

  registerModel = signal({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  registerForm = form(this.registerModel, (f) => {
    required(f.name, { message: 'Nome obbligatorio' });
    required(f.email, { message: 'Email obbligatoria' });
    email(f.email, { message: 'Inserisci un\'email valida' });
    required(f.password, { message: 'Password obbligatoria' });
    minLength(f.password, 8, { message: 'La password deve avere almeno 8 caratteri' });
    required(f.confirmPassword, { message: 'Conferma la password' });
    validate(f.confirmPassword, ({ value, valueOf }) => {
      if (value() !== valueOf(f.password)) {
        return requiredError({ message: 'Le password non coincidono' });
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

  onSubmit() {
    if (this.registerForm().invalid()) {
      return;
    }
    const { name, email, password, confirmPassword } = this.registerModel();
    this.authService.register(name, email, password, confirmPassword);
  }
}
