import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom';
import { AppLayout } from '@/components/layouts/AppLayout';
import { AuthLayout } from '@/components/layouts/AuthLayout';
import { CenteredLayout } from '@/components/layouts/CenteredLayout';
import { LegalLayout } from '@/components/layouts/LegalLayout';
import { Toaster } from '@/components/ui/sonner';
import { RedirectIfSignedIn, RequireAdmin, RequireAuth } from '@/features/auth';
import { AdminAdvicePage } from '@/pages/AdminAdvicePage';
import { AdminMediaPage } from '@/pages/AdminMediaPage';
import { AdminUsersPage } from '@/pages/AdminUsersPage';
import { AdviceExercisesPage } from '@/pages/AdviceExercisesPage';
import { AdviceInstallationPage } from '@/pages/AdviceInstallationPage';
import { AdvicePainPage } from '@/pages/AdvicePainPage';
import { HomePage } from '@/pages/HomePage';
import { LegalNoticePage } from '@/pages/LegalNoticePage';
import { LoginPage } from '@/pages/LoginPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { PrivacyPolicyPage } from '@/pages/PrivacyPolicyPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { SessionPage } from '@/pages/SessionPage';
import { SessionsPage } from '@/pages/SessionsPage';
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
          { path: '/sessions', element: <SessionsPage /> },
          { path: '/sessions/:id', element: <SessionPage /> },
          { path: '/settings/:tab?', element: <SettingsPage /> },
          {
            path: '/conseils',
            element: <Navigate to="/conseils/installation" replace />,
          },
          {
            path: '/conseils/installation',
            element: <AdviceInstallationPage />,
          },
          { path: '/conseils/exercices', element: <AdviceExercisesPage /> },
          { path: '/conseils/douleur', element: <AdvicePainPage /> },
          {
            element: <RequireAdmin />,
            children: [
              {
                path: '/admin',
                element: <Navigate to="/admin/utilisateurs" replace />,
              },
              { path: '/admin/utilisateurs', element: <AdminUsersPage /> },
              { path: '/admin/conseils/:tab?', element: <AdminAdvicePage /> },
              { path: '/admin/medias', element: <AdminMediaPage /> },
            ],
          },
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
  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="bottom-right" richColors />
    </>
  );
}
