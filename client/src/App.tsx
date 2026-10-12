import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom';
import { AdminPage } from '@/pages/AdminPage';
import { AppLayout } from '@/components/layouts/AppLayout';
import { AuthLayout } from '@/components/layouts/AuthLayout';
import { CenteredLayout } from '@/components/layouts/CenteredLayout';
import { LegalLayout } from '@/components/layouts/LegalLayout';
import { RedirectIfSignedIn, RequireAuth } from '@/features/auth';
import { HomePage } from '@/pages/HomePage';
import { LegalNoticePage } from '@/pages/LegalNoticePage';
import { LoginPage } from '@/pages/LoginPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { PrivacyPolicyPage } from '@/pages/PrivacyPolicyPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { StatusPage } from '@/pages/StatusPage';
import { TermsPage } from '@/pages/TermsPage';

const router = createBrowserRouter([
  {
    element: <RequireAuth />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: '/', element: <HomePage /> },
          { path: '/settings/:tab?', element: <SettingsPage /> },
          { path: '/admin', element: <AdminPage /> },
        ],
      },
    ],
  },
  {
    element: <RedirectIfSignedIn />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { path: '/login', element: <LoginPage /> },
          { path: '/register', element: <RegisterPage /> },
        ],
      },
    ],
  },
  {
    element: <LegalLayout />,
    children: [
      { path: '/legal', element: <Navigate to="/legal/notice" replace /> },
      { path: '/legal/notice', element: <LegalNoticePage /> },
      { path: '/legal/privacy', element: <PrivacyPolicyPage /> },
      { path: '/legal/terms', element: <TermsPage /> },
    ],
  },
  {
    element: <CenteredLayout />,
    children: [
      { path: '/status', element: <StatusPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}
