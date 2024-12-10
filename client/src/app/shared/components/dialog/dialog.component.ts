import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  signal,
} from '@angular/core';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
})
export class DialogComponent implements AfterViewInit {
  @ViewChild('dialog') dialogRef!: ElementRef<
    HTMLElement & { close: () => void }
  >;

  @Input() primaryText = '';

  @Input() secondaryText = '';

  @Input() title = '';

  @Input() content = '';

  @Input() open = signal(false);

  @Output() onclose = new EventEmitter();

  @Output() primaryClick = new EventEmitter();

  @Output() secondaryClick = new EventEmitter();

  ngAfterViewInit(): void {
    this.dialogRef.nativeElement.addEventListener('close', () => {
      this.onclose.emit();
    });
  }

  onPrimaryClick() {
    this.primaryClick.emit();

    this.dialogRef.nativeElement.close();
  }

  onSecondaryClick() {
    this.secondaryClick.emit();

    this.dialogRef.nativeElement.close();
  }
}
