import { provideRouter } from '@angular/router'
import { render, screen } from '@testing-library/angular'

import { DashboardPage } from './dashboard-page'

describe('DashboardPage', () => {
  it('links to each management section', async () => {
    await render(DashboardPage, { providers: [provideRouter([])] })

    expect(screen.getByRole('link', { name: 'View Admins' })).toHaveAttribute(
      'href',
      '/dashboard/admin',
    )
    expect(
      screen.getByRole('link', { name: 'View Participants' }),
    ).toHaveAttribute('href', '/dashboard/participant')
    expect(screen.getByRole('link', { name: 'View Juntas' })).toHaveAttribute(
      'href',
      '/dashboard/junta',
    )
  })
})
