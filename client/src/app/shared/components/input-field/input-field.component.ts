import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Injector,
  forwardRef,
  inject,
  input,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NgControl,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputFieldComponent),
      multi: true,
    },
  ],
  imports: [MatFormFieldModule, MatInputModule],
  selector: 'ja-input-field',
  templateUrl: './input-field.component.html',
})
export class InputFieldComponent
  implements ControlValueAccessor, AfterViewInit
{
  private readonly _injector = inject(Injector);
  private readonly _cdr = inject(ChangeDetectorRef);

  readonly placeholder = input('');
  readonly error = input('');
  readonly label = input('');
  readonly name = input('');
  readonly type = input('text');

  value: string | number = '';
  required = false;
  controlDir!: NgControl;
  onChange: ((event: Event) => void) | undefined;

  get hasError() {
    return (
      this.controlDir?.control?.touched && this.controlDir?.control?.errors
    );
  }

  ngAfterViewInit() {
    this.controlDir = this._injector.get(NgControl);
    const validator = this.controlDir.control?.validator?.(
      {} as AbstractControl,
    );
    this.required = !!validator && !!validator['required'];

    this._cdr.detectChanges();
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-function
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
