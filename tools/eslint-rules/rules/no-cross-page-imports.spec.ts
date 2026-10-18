import { RuleTester } from '@typescript-eslint/rule-tester'
import { join } from 'path'

import { RULE_NAME, pageOf, rule } from './no-cross-page-imports'

const pagesDir = join('/repo', 'apps', 'admin', 'src', 'app', 'pages')
const participantFile = join(
  pagesDir,
  'participant',
  'list-feat',
  'list-feat.ts',
)

const ruleTester = new RuleTester()

describe(RULE_NAME, () => {
  it('finds the page of a file', () => {
    expect(pageOf(participantFile)).toBe('participant')
    expect(pageOf(join('/repo', 'apps', 'admin', 'src', 'app', 'app.ts'))).toBe(
      null,
    )
  })

  ruleTester.run(RULE_NAME, rule, {
    valid: [
      {
        code: "import { ParticipantPageState } from '../participant-page-state'",
        filename: participantFile,
      },
      {
        code: "import { ParticipantsApi } from '@/admin/shared/api/participants-api'",
        filename: participantFile,
      },
      {
        code: "import { CreateFeat } from '@/admin/pages/participant/create-feat/create-feat'",
        filename: participantFile,
      },
      {
        code: "import { JuntaPage } from './pages/junta/junta-page'",
        filename: join('/repo', 'apps', 'admin', 'src', 'app', 'routes.ts'),
      },
    ],
    invalid: [
      {
        code: "import { JuntaPageState } from '@/admin/pages/junta/junta-page-state'",
        filename: participantFile,
        errors: [{ messageId: 'crossPage' }],
      },
      {
        code: "import { JuntaPageState } from '../../junta/junta-page-state'",
        filename: participantFile,
        errors: [{ messageId: 'crossPage' }],
      },
      {
        code: "const page = import('../../junta/junta-page')",
        filename: participantFile,
        errors: [{ messageId: 'crossPage' }],
      },
    ],
  })
})
