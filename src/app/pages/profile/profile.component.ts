import { Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormField, form, validate, requiredError } from '@angular/forms/signals';
import { AuthService } from '../../service/auth.service';
import { LanguageService, Lang } from '../../service/language.service';

@Component({
  selector: 'app-profile',
  imports: [DatePipe, FormField],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  authService = inject(AuthService);
  lang = inject(LanguageService);

  profileModel = signal({ name: '', password: '', confirmPassword: '', language: 'it' });

  profileForm = form(this.profileModel, (f) => {
    validate(f.password, ({ value }) => {
      if (value() && value().length < 8) {
        return requiredError({ message: '' });
      }
      return undefined;
    });
    validate(f.confirmPassword, ({ value, valueOf }) => {
      const pwd = valueOf(f.password);
      if (pwd && value() !== pwd) {
        return requiredError({ message: '' });
      }
      return undefined;
    });
  });

  showPassword = signal(false);
  showConfirmPassword = signal(false);
  successMessage = signal('');
  errorMessage = signal('');

  togglePassword() {
    this.showPassword.update((v) => !v);
  }

  toggleConfirmPassword() {
    this.showConfirmPassword.update((v) => !v);
  }

  languages: { value: Lang; label: string }[] = [
    { value: 'it', label: 'Italiano' },
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Español' },
    { value: 'fr', label: 'Français' },
    { value: 'de', label: 'Deutsch' },
  ];

  ngOnInit() {
    const user = this.authService.user();
    if (user) {
      this.profileModel.set({
        name: user.name,
        password: '',
        confirmPassword: '',
        language: user.preference?.language ?? 'it',
      });
    }
  }

  onSubmit(event: Event) {
    event.preventDefault();
    if (this.profileForm().invalid()) {
      return;
    }

    this.errorMessage.set('');
    const formData = this.profileForm().value();
    const payload: Record<string, unknown> = {};

    if (formData.name && formData.name !== this.authService.user()?.name) {
      payload['name'] = formData.name;
    }

    if (formData.password) {
      payload['password'] = formData.password;
      payload['password_confirmation'] = formData.confirmPassword;
    }

    payload['preference'] = { language: formData.language };

    this.lang.setLanguage(formData.language as Lang);

    this.authService.updateUser(payload as any).subscribe({
      next: () => {
        this.authService.loadUser();
        this.profileModel.update((m) => ({ ...m, password: '', confirmPassword: '' }));
        this.successMessage.set(this.lang.t().profile_saved);
        setTimeout(() => this.successMessage.set(''), 3000);
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message ?? 'Error');
      },
    });
  }
}
