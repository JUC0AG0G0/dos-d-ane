import { useParams } from 'react-router-dom';
import { SessionView } from '@/features/sessions';

export function SessionPage() {
  const { id = '' } = useParams();
  // key : repart d'un état neuf en passant d'une session à une autre.
  return <SessionView key={id} id={id} />;
}
