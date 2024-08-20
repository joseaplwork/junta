import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Injector,
  Input,
  forwardRef
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NgControl
} from '@angular/forms';

@Component({
  selector: 'app-input-field',
  templateUrl: './input-field.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputFieldComponent),
      multi: true
    }
  ]
})
export class InputFieldComponent
  implements ControlValueAccessor, AfterViewInit
{
  @Input() public placeholder? = '';

  @Input() public error = '';

  @Input() public label = '';

  @Input() public name = '';

  @Input() public type = 'text';

  public value: string | number = '';

  public required = false;

  public controlDir!: NgControl;

  public onChange: ((event: Event) => void) | undefined;

  constructor(
    private injector: Injector,
    private cdr: ChangeDetectorRef
  ) {}

  public ngAfterViewInit() {
    this.controlDir = this.injector.get(NgControl);
    const validator = this.controlDir.control?.validator?.(
      {} as AbstractControl
    );
    this.required = !!validator && !!validator['required'];

    this.cdr.detectChanges();
  }

  public onTouched() {}

  public writeValue(value: string | number): void {
    this.value = value;
  }

  public registerOnChange(fn: (val: string) => unknown): void {
    this.onChange = (event: Event) => {
      const { value } = event.target as HTMLInputElement;
      fn(value);
    };
  }

  public registerOnTouched(fn: () => unknown): void {
    this.onTouched = fn;
  }
}
