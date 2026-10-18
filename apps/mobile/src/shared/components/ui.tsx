import { ReactNode } from 'react'
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native'

export const colors = {
  primary: '#1565c0',
  text: '#212121',
  muted: '#616161',
  danger: '#c62828',
  success: '#2e7d32',
  border: '#e0e0e0',
  surface: '#ffffff',
  background: '#f5f5f5',
}

export function Card({ children }: { children: ReactNode }): React.JSX.Element {
  return <View style={styles.card}>{children}</View>
}

interface ButtonProps {
  label: string
  onPress: () => void
  busy?: boolean
  variant?: 'primary' | 'link'
}

export function Button({
  label,
  onPress,
  busy = false,
  variant = 'primary',
}: ButtonProps): React.JSX.Element {
  const primary = variant === 'primary'

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ busy, disabled: busy }}
      disabled={busy}
      onPress={onPress}
      style={primary ? styles.button : styles.link}>
      {busy ? (
        <ActivityIndicator color={colors.surface} />
      ) : (
        <Text style={primary ? styles.buttonLabel : styles.linkLabel}>
          {label}
        </Text>
      )}
    </Pressable>
  )
}

interface TextFieldProps
  extends Pick<
    TextInputProps,
    'autoComplete' | 'keyboardType' | 'secureTextEntry' | 'textContentType'
  > {
  label: string
  value: string
  onChangeText: (value: string) => void
  hint?: string
}

export function TextField({
  label,
  hint,
  ...input
}: TextFieldProps): React.JSX.Element {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        autoCapitalize="none"
        style={styles.input}
        {...input}
      />
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  )
}

export function ErrorText({
  children,
}: {
  children: ReactNode
}): React.JSX.Element {
  return (
    <Text accessibilityRole="alert" style={styles.error}>
      {children}
    </Text>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    elevation: 2,
    gap: 8,
    padding: 16,
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  button: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 14,
  },
  buttonLabel: { color: colors.surface, fontSize: 16, fontWeight: '600' },
  link: { alignItems: 'center', paddingVertical: 10 },
  linkLabel: { color: colors.primary, fontSize: 15, fontWeight: '500' },
  field: { gap: 6 },
  label: { color: colors.text, fontSize: 14, fontWeight: '500' },
  input: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 10,
    borderWidth: 1,
    color: colors.text,
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  hint: { color: colors.muted, fontSize: 12 },
  error: { color: colors.danger, fontSize: 14 },
})
