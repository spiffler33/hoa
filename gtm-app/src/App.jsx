import { createHashRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/Layout';
import TodayView from './views/TodayView';
import WeeklyReviewView from './views/WeeklyReviewView';
import ContentView from './views/ContentView';
import PlaybookView from './views/PlaybookView';
import ControlView from './views/ControlView';
import ReferenceView from './views/ReferenceView';
import SettingsView from './views/SettingsView';

const router = createHashRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <TodayView /> },
      { path: '/weekly-review', element: <WeeklyReviewView /> },
      { path: '/content', element: <ContentView /> },
      { path: '/playbook', element: <PlaybookView /> },
      { path: '/control', element: <ControlView /> },
      { path: '/reference', element: <ReferenceView /> },
      { path: '/settings', element: <SettingsView /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
