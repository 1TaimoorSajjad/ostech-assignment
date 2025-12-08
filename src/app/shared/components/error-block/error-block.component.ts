import { Component, EventEmitter, Input, Output } from '@angular/core';

export type ErrorBlockType = 'error' | 'warning' | 'info';

@Component({
  selector: 'app-error-block',
  templateUrl: './error-block.component.html',
  styleUrls: ['./error-block.component.scss']
})
export class ErrorBlockComponent {
  @Input() type: ErrorBlockType = 'error';
  @Input() title: string = '';
  @Input() message: string = 'An error occurred. Please try again.';
  @Input() showRetry: boolean = true;
  @Input() retryText: string = 'Retry';
  @Output() retry = new EventEmitter<void>();

  get icon(): string {
    switch (this.type) {
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      default:
        return 'error';
    }
  }

  onRetry(): void {
    this.retry.emit();
  }
}
