/** Spanish, the app's main language. Every other locale has the same keys. */
export const es = {
  common: {
    retry: 'Reintentar',
    loading: 'Cargando…',
    genericError: 'Algo salió mal. Inténtalo de nuevo.',
  },
  connection: {
    title: 'Conexión',
    checking: 'Comprobando la conexión',
    online: 'Conectado al servidor',
    offline: 'No se puede conectar al servidor',
  },
  auth: {
    signInTitle: 'Iniciar sesión',
    registerTitle: 'Crear cuenta',
    email: 'Correo electrónico',
    password: 'Contraseña',
    passwordHint: 'Al menos 8 caracteres',
    name: 'Nombre',
    surname: 'Apellido',
    phoneNumber: 'Teléfono',
    signIn: 'Entrar',
    register: 'Crear cuenta',
    signOut: 'Cerrar sesión',
    noAccount: '¿No tienes cuenta? Regístrate',
    haveAccount: '¿Ya tienes cuenta? Inicia sesión',
    invalidCredentials: 'Correo o contraseña incorrectos.',
    emailTaken: 'Ya existe una cuenta con ese correo.',
    checkFields:
      'Revisa los datos: correo válido y contraseña de 8 caracteres o más.',
  },
  juntas: {
    title: 'Mis juntas',
    empty:
      'Aún no participas en ninguna junta. El organizador te añadirá a una.',
    payout: 'Cobras en {{month}}',
    groupPays: 'Tu grupo aporta {{amount}} al mes',
    groupSize_one: '{{count}} persona en tu grupo',
    groupSize_other: '{{count}} personas en tu grupo',
    monthlyPool: 'Bolsa mensual',
    schedule: 'Del {{start}} al {{end}}',
    yourGroup: 'Tu grupo',
    payoutTurn: 'Turno {{order}} de {{count}}',
    inactive: 'Inactiva',
  },
}

export type Translations = typeof es
