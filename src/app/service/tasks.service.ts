import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Task } from '../interface/task';
import { ApiResponse } from '../interface/apiResponse';
import { AuthService } from './auth.service';
import { HTTPHEADERREQUEST } from '../helper/httpHeaderRequest';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = 'http://127.0.0.1:8000/api/tasks';

  tasks = signal<Task[]>([]);

  totalTasks = computed(() => this.tasks().length);

  tasksByPriority = computed(() => {
    const tasks = this.tasks();
    return {
      high: tasks.filter((t) => t.attributes.priority === 'high').length,
      medium: tasks.filter((t) => t.attributes.priority === 'medium').length,
      low: tasks.filter((t) => t.attributes.priority === 'low').length,
    };
  });

  recentTasks = computed(() => this.tasks().slice(0, 5));

  todayTasks = computed(() => {
    const today = new Date();
    const todayStr = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;
    return this.tasks().filter((t) => t.attributes.created_at === todayStr).length;
  });

  private get headers() {
    return HTTPHEADERREQUEST.set('Authorization', `Bearer ${this.authService.token()}`);
  }

  loadTasks() {
    this.http
      .get<ApiResponse<Task[]>>(this.apiUrl, { headers: this.headers })
      .subscribe((res) => this.tasks.set(res.data));
  }

  createTask(data: { name: string; description: string; priority: string }) {
    return this.http.post<ApiResponse<Task>>(this.apiUrl, data, { headers: this.headers });
  }

  updateTask(id: string, data: { name?: string; description?: string; priority?: string }) {
    return this.http.put<ApiResponse<Task>>(`${this.apiUrl}/${id}`, data, { headers: this.headers });
  }

  deleteTask(id: string) {
    return this.http.delete<ApiResponse<string>>(`${this.apiUrl}/${id}`, { headers: this.headers });
  }
}
