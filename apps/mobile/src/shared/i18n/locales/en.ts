import { Translations } from './es'

export const en: Translations = {
  common: {
    retry: 'Retry',
    loading: 'Loading…',
    genericError: 'Something went wrong. Please try again.',
  },
  connection: {
    title: 'Connection',
    checking: 'Checking the connection',
    online: 'Connected to the server',
    offline: 'Cannot reach the server',
  },
  auth: {
    signInTitle: 'Sign in',
    registerTitle: 'Create account',
    email: 'Email',
    password: 'Password',
    passwordHint: 'At least 8 characters',
    name: 'First name',
    surname: 'Last name',
    phoneNumber: 'Phone',
    signIn: 'Sign in',
    register: 'Create account',
    signOut: 'Sign out',
    noAccount: 'No account? Sign up',
    haveAccount: 'Already have an account? Sign in',
    invalidCredentials: 'Wrong email or password.',
    emailTaken: 'An account with that email already exists.',
    checkFields:
      'Check your details: a valid email and a password of 8 characters or more.',
  },
  juntas: {
    title: 'My juntas',
    empty: 'You are not in any junta yet. The organizer will add you to one.',
    payout: 'You collect in {{month}}',
    groupPays: 'Your group pays {{amount}} a month',
    groupSize_one: '{{count}} person in your group',
    groupSize_other: '{{count}} people in your group',
    monthlyPool: 'Monthly pool',
    schedule: 'From {{start}} to {{end}}',
    yourGroup: 'Your group',
    payoutTurn: 'Turn {{order}} of {{count}}',
    inactive: 'Inactive',
  },
}
