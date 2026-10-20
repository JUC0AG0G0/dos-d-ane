import { type ComponentType, lazy, Suspense } from 'react';
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom';
import { AppLayout } from '@/components/layouts/AppLayout';
import { AuthLayout } from '@/components/layouts/AuthLayout';
import { CenteredLayout } from '@/components/layouts/CenteredLayout';
import { LegalLayout } from '@/components/layouts/LegalLayout';
import { RedirectIfSignedIn, RequireAdmin, RequireAuth } from '@/features/auth';

function lazyPage<K extends string>(
  load: () => Promise<Record<K, ComponentType>>,
  name: K,
) {
  const Page = lazy<ComponentType>(() =>
    load().then((m) => ({ default: m[name] })),
  );
  return function LazyPage() {
    return (
      <Suspense fallback={null}>
        <Page />
      </Suspense>
    );
  };
}

const AdminAdvicePage = lazyPage(
  () => import('@/pages/AdminAdvicePage'),
  'AdminAdvicePage',
);
const AdminMediaPage = lazyPage(
  () => import('@/pages/AdminMediaPage'),
  'AdminMediaPage',
);
const AdminUsersPage = lazyPage(
  () => import('@/pages/AdminUsersPage'),
  'AdminUsersPage',
);
const AdviceExercisesPage = lazyPage(
  () => import('@/pages/AdviceExercisesPage'),
  'AdviceExercisesPage',
);
const AdviceInstallationPage = lazyPage(
  () => import('@/pages/AdviceInstallationPage'),
  'AdviceInstallationPage',
);
const AdvicePainPage = lazyPage(
  () => import('@/pages/AdvicePainPage'),
  'AdvicePainPage',
);
const HomePage = lazyPage(() => import('@/pages/HomePage'), 'HomePage');
const LegalNoticePage = lazyPage(
  () => import('@/pages/LegalNoticePage'),
  'LegalNoticePage',
);
const LoginPage = lazyPage(() => import('@/pages/LoginPage'), 'LoginPage');
const NotFoundPage = lazyPage(
  () => import('@/pages/NotFoundPage'),
  'NotFoundPage',
);
const PrivacyPolicyPage = lazyPage(
  () => import('@/pages/PrivacyPolicyPage'),
  'PrivacyPolicyPage',
);
const RegisterPage = lazyPage(
  () => import('@/pages/RegisterPage'),
  'RegisterPage',
);
const SettingsPage = lazyPage(
  () => import('@/pages/SettingsPage'),
  'SettingsPage',
);
const StatusPage = lazyPage(() => import('@/pages/StatusPage'), 'StatusPage');
const TermsPage = lazyPage(() => import('@/pages/TermsPage'), 'TermsPage');

const router = createBrowserRouter([
  {
    element: <RequireAuth />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: '/', element: <HomePage /> },
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
  return <RouterProvider router={router} />;
}
