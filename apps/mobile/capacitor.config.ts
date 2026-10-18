import type { CapacitorConfig } from '@capacitor/cli'

/**
 * `appId` is a placeholder. The stores reject `com.example` ids, and changing
 * the id after `cap add` means editing both native projects, so decide it
 * before adding iOS or Android (open question in spec 003).
 */
const config: CapacitorConfig = {
  appId: 'com.example.junta',
  appName: 'Junta',
  webDir: '../../dist/mobile/browser',
}

export default config
