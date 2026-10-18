import { Stack } from 'expo-router'

import { HomeScreen } from '@/mobile/screens/home/home-screen'

/** Routes stay thin: set the header, render the screen. */
export default function HomeRoute(): React.JSX.Element {
  return (
    <>
      <Stack.Screen options={{ title: 'Junta' }} />
      <HomeScreen />
    </>
  )
}
