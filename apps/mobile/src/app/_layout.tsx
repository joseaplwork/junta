import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

export default function RootLayout(): React.JSX.Element {
  return (
    <>
      <Stack />
      <StatusBar style="auto" />
    </>
  )
}
