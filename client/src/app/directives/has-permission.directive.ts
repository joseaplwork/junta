import {
  Directive,
  TemplateRef,
  ViewContainerRef,
  inject,
  input,
} from '@angular/core';

import { AdminProfileService } from '@client/shared/services';
import { Permission } from '@server/enums';

@Directive({
  selector: '[hasPermission]',
})
export class HasPermissionDirective {
  private readonly _profile = inject(AdminProfileService);
  private readonly _viewContainer = inject(ViewContainerRef);
  private readonly _templateRef = inject(TemplateRef<unknown>);

  private _checkPermission = (permission: keyof typeof Permission) => {
    if (this._hasPermission(permission)) {
      this._viewContainer.createEmbeddedView(this._templateRef);
    } else {
      this._viewContainer.clear();
    }
  };

  private _hasPermission(requiredPermission: keyof typeof Permission): boolean {
    return this._profile.permissions().includes(Permission[requiredPermission]);
  }

  hasPermission = input(null, { transform: this._checkPermission });
}
