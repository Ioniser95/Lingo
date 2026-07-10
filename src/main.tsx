import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import HomePage from './routes/index';
import LessonPage from './routes/lesson.$lessonId';
import LeaderboardPage from './routes/leaderboard';
import ProfilePage from './routes/profile';
import SettingsPage from './routes/settings';
import ShopPage from './routes/shop';

import './styles.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/lesson/:lessonId',
    element: <LessonPage />,
  },
  {
    path: '/leaderboard',
    element: <LeaderboardPage />,
  },
  {
    path: '/profile',
    element: <ProfilePage />,
  },
  {
    path: '/settings',
    element: <SettingsPage />,
  },
  {
    path: '/shop',
    element: <ShopPage />,
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
