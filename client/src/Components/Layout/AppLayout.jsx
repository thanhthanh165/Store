import { useOutlet } from 'react-router-dom';
import FacebookMsg from '../FacebookMsg';

function AppLayout() {
  const outlet = useOutlet();

  return (
    <div>
      {outlet}
      <FacebookMsg />
    </div>
  );
}

export default AppLayout;
