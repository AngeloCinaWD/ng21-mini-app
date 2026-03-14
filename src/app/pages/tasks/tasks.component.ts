import { Component, inject, OnInit, signal } from '@angular/core';
import { TasksService } from '../../service/tasks.service';
import { TaskFormModalComponent } from '../../components/task-form-modal/task-form-modal.component';
import { ConfirmModalComponent } from '../../components/confirm-modal/confirm-modal.component';
import { Task } from '../../interface/task';

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

  ngOnInit() {
    this.tasksService.loadTasks();
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
