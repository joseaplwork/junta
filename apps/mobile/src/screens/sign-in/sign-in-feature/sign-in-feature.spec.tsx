import { fireEvent, render, screen } from '@testing-library/react-native'

import { ApiError } from '@/mobile/shared/api/api-client'
import { useSession } from '@/mobile/shared/auth/session'

import { SignInFeature } from './sign-in-feature'

jest.mock('@/mobile/shared/auth/session', () => ({ useSession: jest.fn() }))

describe('SignInFeature', () => {
  const signIn = jest.fn()

  beforeEach(() => {
    signIn.mockReset()
    ;(useSession as jest.Mock).mockReturnValue({ signIn })
  })

  it('signs in with the typed credentials', async () => {
    signIn.mockResolvedValue(undefined)

    await render(<SignInFeature onRegister={jest.fn()} />)
    await fireEvent.changeText(
      screen.getByLabelText('Correo electrónico'),
      'rosa@junta.test',
    )
    await fireEvent.changeText(
      screen.getByLabelText('Contraseña'),
      'rosa-password',
    )
    await fireEvent.press(screen.getByRole('button', { name: 'Entrar' }))

    expect(signIn).toHaveBeenCalledWith({
      email: 'rosa@junta.test',
      password: 'rosa-password',
    })
  })

  it('explains wrong credentials', async () => {
    signIn.mockRejectedValue(new ApiError(401, 'Unauthorized'))

    await render(<SignInFeature onRegister={jest.fn()} />)
    await fireEvent.press(screen.getByRole('button', { name: 'Entrar' }))

    expect(
      await screen.findByText('Correo o contraseña incorrectos.'),
    ).toBeOnTheScreen()
  })
})
