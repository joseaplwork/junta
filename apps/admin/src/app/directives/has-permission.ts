import {
  Directive,
  TemplateRef,
  ViewContainerRef,
  inject,
  input,
} from '@angular/core'

import { Permission } from '@junta/shared/enums/permission'

import { AdminProfile } from '@/admin/shared/services/admin-profile'

@Directive({
  selector: '[hasPermission]',
})
export class HasPermission {
  private readonly _profile = inject(AdminProfile)
  private readonly _viewContainer = inject(ViewContainerRef)
  private readonly _templateRef = inject(TemplateRef)

  private _checkPermission = (permission: keyof typeof Permission) => {
    if (this._profile.hasPermission(permission)) {
      this._viewContainer.createEmbeddedView(this._templateRef)
    } else {
      this._viewContainer.clear()
    }
  }

  hasPermission = input(null, { transform: this._checkPermission })
}
