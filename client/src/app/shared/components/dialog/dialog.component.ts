import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
})
export class DialogComponent implements AfterViewInit, OnDestroy {
  @ViewChild('dialog') dialogRef!: ElementRef<
    HTMLElement & { close: () => void }
  >;

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
    const dialog = this.dialogRef.nativeElement;

    dialog.addEventListener('close', this.onClose);
    dialog.addEventListener('cancel', this.onCancel);
  }

  ngOnDestroy() {
    const dialog = this.dialogRef.nativeElement;

    dialog.removeEventListener('close', this.onClose);
    dialog.removeEventListener('cancel', this.onCancel);
  }

  onPrimaryClick() {
    this.primaryClick.emit();

    this.dialogRef.nativeElement.close();
  }

  onSecondaryClick() {
    this.secondaryClick.emit();

    this.dialogRef.nativeElement.close();
  }

  onClose = () => {
    this.onclose.emit();
  };

  onCancel = () => {
    this.oncancel.emit();
  };
}
