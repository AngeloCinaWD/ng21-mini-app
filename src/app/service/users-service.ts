import { HttpClient, httpResource } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { User } from '../interface/user';
import { Error } from '../interface/error';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private urlJsonPlaceholder = 'https://jsonplaceholder.typicode.com/users';

  private http = inject(HttpClient);

  private users = signal<User[]>([]);

  usersPublic = computed<User[]>(() => this.users());

  usersHttpResource = httpResource<User[]>(() => this.urlJsonPlaceholder);

  usernameUsers = computed<User['username'][]>(() =>
    (this.usersHttpResource.value() ?? []).map((user: User) => user.username)
  );

  private error = signal<Error>({
    status: false,
  });

  errorPublic = computed<Error>(() => this.error());

  constructor() {
    this.http
      .get<User[]>(this.urlJsonPlaceholder)
      .pipe(map((users) => users))
      .subscribe({
        next: (data) => this.users.set(data),
        error: (err) =>
          this.error.update((current: Error) => {
            return {
              ...current,
              status: true,
              message: err.message,
            };
          }),
      });

    console.log(this.usersHttpResource.value());
    console.log(this.usersHttpResource.error());
    console.log(this.usersHttpResource.status());
    console.log(this.usersHttpResource.error());
    console.log(this.usersHttpResource.headers());
    console.log(this.usersHttpResource.hasValue());
  }
}
