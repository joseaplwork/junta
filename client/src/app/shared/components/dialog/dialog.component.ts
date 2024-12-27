import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';

import { ButtonComponent } from '@client/shared/components';

@Component({
  selector: 'ja-dialog',
  imports: [CommonModule, ButtonComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './dialog.component.html',
})
export class DialogComponent implements AfterViewInit, OnDestroy {
  @ViewChild('dialog') dialog!: ElementRef<HTMLElement & { close: () => void }>;

  @Input() primaryText = '';

  @Input() secondaryText = '';

  @Input() title = '';

  @Input() content = '';

  @Input() open = false;

  @Output() onclose = new EventEmitter();

  @Output() oncancel = new EventEmitter();

  @Output() primaryClick = new EventEmitter();

  @Output() secondaryClick = new EventEmitter();

  ngAfterViewInit() {
    const dialog = this.dialog.nativeElement;

    dialog.addEventListener('close', this.onClose);
    dialog.addEventListener('cancel', this.onCancel);
  }

  ngOnDestroy() {
    const dialog = this.dialog.nativeElement;

    dialog.removeEventListener('close', this.onClose);
    dialog.removeEventListener('cancel', this.onCancel);
  }

  onPrimaryClick() {
    this.primaryClick.emit();

    this.dialog.nativeElement.close();
  }

  onSecondaryClick() {
    this.secondaryClick.emit();

    this.dialog.nativeElement.close();
  }

  onClose = () => {
    this.onclose.emit();
  };

  onCancel = () => {
    this.oncancel.emit();
  };
}
