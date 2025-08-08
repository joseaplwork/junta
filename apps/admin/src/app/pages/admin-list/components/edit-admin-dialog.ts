import { Component, inject } from '@angular/core'
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatSelectModule } from '@angular/material/select'

import { Role } from '@junta/shared/enums/role'

import { Admin } from '@/admin/shared/interfaces/admin'

@Component({
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  template: `
    <h2 mat-dialog-title>Edit Admin</h2>
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <div mat-dialog-content>
        <mat-form-field class="w-full">
          <mat-label>Email</mat-label>
          <input matInput formControlName="email" />
          @if (
            form.get('email')?.hasError('required') &&
            form.get('email')?.touched
          ) {
            <mat-error>Email is required</mat-error>
          }
          @if (form.get('email')?.hasError('email')) {
            <mat-error>Please enter a valid email</mat-error>
          }
        </mat-form-field>

        <mat-form-field class="w-full">
          <mat-label>First Name</mat-label>
          <input matInput formControlName="name" />
          @if (
            form.get('name')?.hasError('required') && form.get('name')?.touched
          ) {
            <mat-error>First name is required</mat-error>
          }
        </mat-form-field>

        <mat-form-field class="w-full">
          <mat-label>Last Name</mat-label>
          <input matInput formControlName="surname" />
          @if (
            form.get('surname')?.hasError('required') &&
            form.get('surname')?.touched
          ) {
            <mat-error>Last name is required</mat-error>
          }
        </mat-form-field>

        <mat-form-field class="w-full">
          <mat-label>Phone</mat-label>
          <input matInput formControlName="phoneNumber" />
          @if (
            form.get('phoneNumber')?.hasError('required') &&
            form.get('phoneNumber')?.touched
          ) {
            <mat-error>Phone is required</mat-error>
          }
        </mat-form-field>

        <mat-form-field class="w-full">
          <mat-label>Roles</mat-label>
          <mat-select formControlName="roles" multiple>
            <mat-option [value]="Role.SUPER_ADMIN">Super Admin</mat-option>
            <mat-option [value]="Role.ADMIN">Admin</mat-option>
          </mat-select>
          @if (
            form.get('roles')?.hasError('required') &&
            form.get('roles')?.touched
          ) {
            <mat-error>At least one role is required</mat-error>
          }
        </mat-form-field>
      </div>

      <div mat-dialog-actions align="end">
        <button mat-button (click)="onCancel()" type="button">Cancel</button>
        <button
          mat-raised-button
          color="primary"
          type="submit"
          [disabled]="form.invalid">
          Save
        </button>
      </div>
    </form>
  `,
})
export class EditAdminDialog {
  private readonly _fb = inject(FormBuilder)
  private readonly _dialogRef = inject(MatDialogRef<EditAdminDialog>)
  public readonly data = inject<Admin>(MAT_DIALOG_DATA)

  form: FormGroup
  Role = Role

  constructor() {
    this.form = this._fb.group({
      email: [this.data.email, [Validators.required, Validators.email]],
      name: [this.data.user.name, [Validators.required]],
      surname: [this.data.user.surname, [Validators.required]],
      phoneNumber: [this.data.user.phoneNumber, [Validators.required]],
      roles: [this.data.roles, [Validators.required]],
    })
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formData = this.form.value

      this._dialogRef.close(formData)
    }
  }

  onCancel(): void {
    this._dialogRef.close()
  }
}
