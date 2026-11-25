import { RouterProvider } from 'react-router-dom';
import { appRouter } from './routes/AppRouter';
import { CallManagerProvider } from '@/context/CallManager';

function App() {
  return <CallManagerProvider><RouterProvider router={appRouter} /></CallManagerProvider>;
}

export default App;
