import {
  Directive,
  TemplateRef,
  ViewContainerRef,
  effect,
  inject,
  input,
} from '@angular/core'

import { Permission } from '@junta/contracts'

import { AdminProfile } from '@/admin/shared/services/admin-profile'

/** `*jaHasPermission="Permission.X"` renders the element only for admins holding X. */
@Directive({ selector: '[jaHasPermission]' })
export class HasPermission {
  private readonly _profile = inject(AdminProfile)
  private readonly _viewContainer = inject(ViewContainerRef)
  private readonly _templateRef = inject(TemplateRef)

  private _rendered = false

  readonly jaHasPermission = input<Permission | null>(null)

  constructor() {
    effect(() => {
      const permission = this.jaHasPermission()
      const allowed =
        permission === null || this._profile.hasPermission(permission)

      if (allowed === this._rendered) return

      this._rendered = allowed
      this._viewContainer.clear()

      if (allowed) {
        this._viewContainer.createEmbeddedView(this._templateRef)
      }
    })
  }
}
