import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

import { AdminProfileService } from '@client/shared/services/admin-profile.service';
import { Permission } from '@server/enums';

@Directive({
  selector: '[hasPermission]',
})
export class HasPermissionDirective {
  constructor(
    private templateRef: TemplateRef<unknown>,
    private viewContainer: ViewContainerRef,
    private _adminProfile: AdminProfileService,
  ) {}

  @Input() set hasPermission(permission: keyof typeof Permission) {
    if (this._hasPermission(permission)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }

  private _hasPermission(requiredPermission: keyof typeof Permission): boolean {
    return this._adminProfile
      .permissions()
      .includes(Permission[requiredPermission]);
  }
}
