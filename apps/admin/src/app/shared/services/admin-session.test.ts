import { TestBed } from '@angular/core/testing'
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing'
import 'zone.js'

import { AccessTokenManager } from './access-token-manager'
import { AdminSession } from './admin-session'
import { AppState } from './app-state'
import { Navigation } from './navigation'

TestBed.initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
)

describe('AdminSession', () => {
  let adminSession: AdminSession
  let mockAccessTokenManager: jest.Mocked<AccessTokenManager>
  let mockNavigation: jest.Mocked<Navigation>
  let mockAppState: jest.Mocked<AppState>

  beforeEach(() => {
    // Create mocks for all dependencies
    mockAccessTokenManager = {
      setAccessToken: jest.fn(),
      removeAccessToken: jest.fn(),
      isAccessTokenExpired: jest.fn(),
    } as any

    mockNavigation = {
      goToDashboardPage: jest.fn().mockReturnValue(Promise.resolve(true)),
      goToLoginPage: jest.fn().mockReturnValue(Promise.resolve(true)),
    } as any

    mockAppState = {
      startSession: jest.fn(),
      endSession: jest.fn(),
    } as any

    // Configure TestBed with mocked services
    TestBed.configureTestingModule({
      providers: [
        AdminSession,
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
      // Arrange
      const accessToken = 'test-token'

      // Act
      adminSession.startSessionAndRedirect(accessToken)

      // Assert
      expect(mockAccessTokenManager.setAccessToken).toHaveBeenCalledWith(
        accessToken,
      )
      expect(mockAppState.startSession).toHaveBeenCalled()
      expect(mockNavigation.goToDashboardPage).toHaveBeenCalled()
    })
  })

  describe('endSessionAndRedirect', () => {
    it('should remove access token, end session, and navigate to login page', () => {
      // Act
      adminSession.endSessionAndRedirect()

      // Assert
      expect(mockAccessTokenManager.removeAccessToken).toHaveBeenCalled()
      expect(mockAppState.endSession).toHaveBeenCalled()
      expect(mockNavigation.goToLoginPage).toHaveBeenCalled()
    })
  })

  describe('redirectIfAuthenticated', () => {
    it('should redirect to dashboard when token is not expired', async () => {
      // Arrange
      mockAccessTokenManager.isAccessTokenExpired.mockReturnValue(false)

      // Act
      const result = await adminSession.redirectIfAuthenticated()

      // Assert
      expect(mockNavigation.goToDashboardPage).toHaveBeenCalled()
      expect(result).toBe(true) // Assuming goToDashboardPage returns Promise.resolve(true)
    })

    it('should resolve with true when token is expired', async () => {
      // Arrange
      mockAccessTokenManager.isAccessTokenExpired.mockReturnValue(true)

      // Act
      const result = await adminSession.redirectIfAuthenticated()

      // Assert
      expect(mockNavigation.goToDashboardPage).not.toHaveBeenCalled()
      expect(result).toBe(true)
    })
  })

  describe('redirectIfNotAuthenticated', () => {
    it('should redirect to login page when token is expired', async () => {
      // Arrange
      mockAccessTokenManager.isAccessTokenExpired.mockReturnValue(true)

      // Act
      const result = await adminSession.redirectIfNotAuthenticated()

      // Assert
      expect(mockNavigation.goToLoginPage).toHaveBeenCalled()
      expect(result).toBe(true) // Assuming goToLoginPage returns Promise.resolve(true)
    })

    it('should resolve with true when token is not expired', async () => {
      // Arrange
      mockAccessTokenManager.isAccessTokenExpired.mockReturnValue(false)

      // Act
      const result = await adminSession.redirectIfNotAuthenticated()

      // Assert
      expect(mockNavigation.goToLoginPage).not.toHaveBeenCalled()
      expect(result).toBe(true)
    })
  })
})
