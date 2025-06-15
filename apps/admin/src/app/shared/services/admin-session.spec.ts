import { provideZonelessChangeDetection } from '@angular/core'
import { TestBed } from '@angular/core/testing'

import { AccessTokenManager } from './access-token-manager'
import { AdminSession } from './admin-session'
import { AppState } from './app-state'
import { Navigation } from './navigation'

class MockAccessTokenManager implements Partial<AccessTokenManager> {
  setAccessToken = jest.fn()
  removeAccessToken = jest.fn()
  isAccessTokenExpired = jest.fn()
}

class MockNavigation implements Partial<Navigation> {
  goToDashboardPage = jest.fn().mockReturnValue(Promise.resolve(true))
  goToLoginPage = jest.fn().mockReturnValue(Promise.resolve(true))
}

class MockAppState implements Partial<AppState> {
  startSession = jest.fn()
  endSession = jest.fn()
}

describe('AdminSession', () => {
  let adminSession: AdminSession
  let mockAccessTokenManager: MockAccessTokenManager
  let mockNavigation: MockNavigation
  let mockAppState: MockAppState

  beforeEach(async () => {
    mockAccessTokenManager = new MockAccessTokenManager()
    mockNavigation = new MockNavigation()
    mockAppState = new MockAppState()

    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        { provide: AccessTokenManager, useValue: mockAccessTokenManager },
        { provide: Navigation, useValue: mockNavigation },
        { provide: AppState, useValue: mockAppState },
      ],
    })

    adminSession = TestBed.inject(AdminSession)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('startSessionAndRedirect', () => {
    it('should set access token, start session, and navigate to dashboard', () => {
      const accessToken = 'test-token'

      adminSession.startSessionAndRedirect(accessToken)

      expect(mockAccessTokenManager.setAccessToken).toHaveBeenCalledWith(
        accessToken,
      )
      expect(mockAppState.startSession).toHaveBeenCalled()
      expect(mockNavigation.goToDashboardPage).toHaveBeenCalled()
    })
  })

  describe('endSessionAndRedirect', () => {
    it('should remove access token, end session, and navigate to login page', () => {
      adminSession.endSessionAndRedirect()

      expect(mockAccessTokenManager.removeAccessToken).toHaveBeenCalled()
      expect(mockAppState.endSession).toHaveBeenCalled()
      expect(mockNavigation.goToLoginPage).toHaveBeenCalled()
    })
  })

  describe('redirectIfAuthenticated', () => {
    it('should redirect to dashboard when token is not expired', async () => {
      mockAccessTokenManager.isAccessTokenExpired.mockReturnValue(false)

      const result = await adminSession.redirectIfAuthenticated()

      expect(mockNavigation.goToDashboardPage).toHaveBeenCalled()
      expect(result).toBe(true)
    })

    it('should resolve with true when token is expired', async () => {
      mockAccessTokenManager.isAccessTokenExpired.mockReturnValue(true)

      const result = await adminSession.redirectIfAuthenticated()

      expect(mockNavigation.goToDashboardPage).not.toHaveBeenCalled()
      expect(result).toBe(true)
    })
  })

  describe('redirectIfNotAuthenticated', () => {
    it('should redirect to login page when token is expired', async () => {
      mockAccessTokenManager.isAccessTokenExpired.mockReturnValue(true)

      const result = await adminSession.redirectIfNotAuthenticated()

      expect(mockNavigation.goToLoginPage).toHaveBeenCalled()
      expect(result).toBe(true)
    })

    it('should resolve with true when token is not expired', async () => {
      mockAccessTokenManager.isAccessTokenExpired.mockReturnValue(false)

      const result = await adminSession.redirectIfNotAuthenticated()

      expect(mockNavigation.goToLoginPage).not.toHaveBeenCalled()
      expect(result).toBe(true)
    })
  })
})
