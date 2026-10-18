import '@testing-library/jest-dom'
import { setupZonelessTestEnv } from 'jest-preset-angular/setup-env/zoneless'

setupZonelessTestEnv({
  teardown: { destroyAfterEach: true },
  errorOnUnknownElements: true,
  errorOnUnknownProperties: true,
})
