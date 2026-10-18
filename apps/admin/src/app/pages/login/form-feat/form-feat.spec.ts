import { render, screen } from '@testing-library/angular'
import userEvent from '@testing-library/user-event'

import { AdminSession } from '@/admin/shared/services/admin-session'

import { FormFeat } from './form-feat'

async function setup(login: jest.Mock) {
  await render(FormFeat, {
    providers: [{ provide: AdminSession, useValue: { login } }],
  })

  const user = userEvent.setup()

  await user.type(screen.getByLabelText('Email'), 'ana@junta.test')
  await user.type(screen.getByLabelText('Password'), 'secret')
  await user.click(screen.getByRole('button', { name: 'Login' }))
}

describe('Login FormFeat', () => {
  it('logs in with the typed credentials', async () => {
    const login = jest.fn().mockResolvedValue(undefined)

    await setup(login)

    expect(login).toHaveBeenCalledWith({
      email: 'ana@junta.test',
      password: 'secret',
    })
    expect(screen.queryByText('Login credentials invalid')).toBeNull()
  })

  it('shows an error when the credentials are rejected', async () => {
    await setup(jest.fn().mockRejectedValue(new Error('401')))

    expect(
      await screen.findByText('Login credentials invalid'),
    ).toBeInTheDocument()
  })
})
