import { JuntaDetailFeature } from './junta-detail-feature/junta-detail-feature'

export function JuntaDetailScreen({ id }: { id: string }): React.JSX.Element {
  return <JuntaDetailFeature id={id} />
}
