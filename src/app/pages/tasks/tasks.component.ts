import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { TasksService } from '../../service/tasks.service';
import { TaskFormModalComponent } from '../../components/task-form-modal/task-form-modal.component';
import { ConfirmModalComponent } from '../../components/confirm-modal/confirm-modal.component';
import { Task } from '../../interface/task';

type SortColumn = 'priority' | 'created_at';
type SortDirection = 'asc' | 'desc';

const PRIORITY_ORDER: Record<string, number> = { low: 0, medium: 1, high: 2 };

@Component({
  selector: 'app-tasks',
  imports: [TaskFormModalComponent, ConfirmModalComponent],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css',
})
export class TasksComponent implements OnInit {
  tasksService = inject(TasksService);

  showFormModal = signal(false);
  editingTask = signal<Task | null>(null);
  deletingTask = signal<Task | null>(null);
  successMessage = signal('');

  sortColumn = signal<SortColumn | null>(null);
  sortDirection = signal<SortDirection>('asc');

  sortedTasks = computed<Task[]>(() => {
    const tasks = [...this.tasksService.tasks()];
    const col = this.sortColumn();
    const dir = this.sortDirection();
    if (!col) return tasks;

    return tasks.sort((a, b) => {
      let cmp: number;
      if (col === 'priority') {
        cmp = PRIORITY_ORDER[a.attributes.priority] - PRIORITY_ORDER[b.attributes.priority];
      } else {
        const [dA, mA, yA] = a.attributes.created_at.split('/').map(Number);
        const [dB, mB, yB] = b.attributes.created_at.split('/').map(Number);
        cmp = (yA * 10000 + mA * 100 + dA) - (yB * 10000 + mB * 100 + dB);
      }
      return dir === 'asc' ? cmp : -cmp;
    });
  });

  ngOnInit() {
    this.tasksService.loadTasks();
  }

  toggleSort(column: SortColumn) {
    if (this.sortColumn() === column) {
      this.sortDirection.update((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      this.sortColumn.set(column);
      this.sortDirection.set('asc');
    }
  }

  openCreate() {
    this.editingTask.set(null);
    this.showFormModal.set(true);
  }

  openEdit(task: Task) {
    this.editingTask.set(task);
    this.showFormModal.set(true);
  }

  closeFormModal() {
    this.showFormModal.set(false);
    this.editingTask.set(null);
  }

  onSaved() {
    const isEdit = this.editingTask() !== null;
    this.closeFormModal();
    this.tasksService.loadTasks();
    this.showSuccess(isEdit ? 'Task modificato con successo' : 'Task creato con successo');
  }

  confirmDelete(task: Task) {
    this.deletingTask.set(task);
  }

  cancelDelete() {
    this.deletingTask.set(null);
  }

  executeDelete() {
    const task = this.deletingTask()!;
    this.deletingTask.set(null);
    this.tasksService.deleteTask(task.id).subscribe(() => {
      this.tasksService.loadTasks();
      this.showSuccess('Task eliminato con successo');
    });
  }

  private showSuccess(message: string) {
    this.successMessage.set(message);
    setTimeout(() => this.successMessage.set(''), 3000);
  }
}
