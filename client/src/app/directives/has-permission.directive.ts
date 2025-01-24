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
  private readonly _templateRef = inject(TemplateRef);

  private _checkPermission = (permission: keyof typeof Permission) => {
    if (this._profile.hasPermission(permission)) {
      this._viewContainer.createEmbeddedView(this._templateRef);
    } else {
      this._viewContainer.clear();
    }
  };

  hasPermission = input(null, { transform: this._checkPermission });
}
