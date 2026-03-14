import { HttpClient, httpResource } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { UserJP } from '../interface/userJp';
import { Error } from '../interface/error';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private urlJsonPlaceholder = 'https://jsonplaceholder.typicode.com/users';

  private http = inject(HttpClient);

  private users = signal<UserJP[]>([]);

  usersPublic = computed<UserJP[]>(() => this.users());

  usersHttpResource = httpResource<UserJP[]>(() => this.urlJsonPlaceholder);

  usernameUsers = computed<UserJP['username'][]>(() =>
    (this.usersHttpResource.value() ?? []).map((user: UserJP) => user.username),
  );

  private error = signal<Error>({
    status: false,
  });

  errorPublic = computed<Error>(() => this.error());

  getUserById(id: number): Observable<UserJP> {
    return this.http.get<UserJP>(`${this.urlJsonPlaceholder}/${id}`);
  }

  constructor() {
    this.http
      .get<UserJP[]>(this.urlJsonPlaceholder)
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
  }
}
