import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Injector,
  Input,
  forwardRef,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NgControl,
} from '@angular/forms';

@Component({
  selector: 'app-input-field',
  templateUrl: './input-field.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputFieldComponent),
      multi: true,
    },
  ],
})
export class InputFieldComponent
  implements ControlValueAccessor, AfterViewInit
{
  @Input() placeholder? = '';

  @Input() error = '';

  @Input() label = '';

  @Input() name = '';

  @Input() type = 'text';

  value: string | number = '';

  required = false;

  controlDir!: NgControl;

  onChange: ((event: Event) => void) | undefined;

  constructor(
    private injector: Injector,
    private cdr: ChangeDetectorRef,
  ) {}

  get hasError() {
    return (
      this.controlDir?.control?.touched && this.controlDir?.control?.errors
    );
  }

  ngAfterViewInit() {
    this.controlDir = this.injector.get(NgControl);
    const validator = this.controlDir.control?.validator?.(
      {} as AbstractControl,
    );
    this.required = !!validator && !!validator['required'];

    this.cdr.detectChanges();
  }

  onTouched() {}

  writeValue(value: string | number): void {
    this.value = value;
  }

  registerOnChange(fn: (val: string) => unknown): void {
    this.onChange = (event: Event) => {
      const { value } = event.target as HTMLInputElement;
      fn(value);
    };
  }

  registerOnTouched(fn: () => unknown): void {
    this.onTouched = fn;
  }

  getErrorMessage() {
    if (this.controlDir?.control?.errors?.['required']) {
      return 'This field is required';
    }

    if (this.controlDir?.control?.errors?.['email']) {
      return 'Invalid email';
    }

    return '';
  }
}
