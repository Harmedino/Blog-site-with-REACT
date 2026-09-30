import type { ComponentType } from "react";
import { createBrowserRouter, Navigate } from "react-router";
import { RootLayout } from "@/components/layout/RootLayout";
import { RequireAuth } from "@/features/auth/RequireAuth";
import ErrorPage from "@/routes/ErrorPage";
import LegacyPostRedirect from "@/routes/LegacyPostRedirect";

/** Code-split a page: its chunk loads on first navigation. */
const page = (load: () => Promise<{ default: ComponentType }>) => async () => ({ Component: (await load()).default });

const protectedPage = (load: () => Promise<{ default: ComponentType }>) => async () => {
  const { default: Page } = await load();
  return {
    Component: () => (
      <RequireAuth>
        <Page />
      </RequireAuth>
    ),
  };
};

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, lazy: page(() => import("@/routes/HomePage")) },
      { path: "blog", lazy: page(() => import("@/routes/BlogPage")) },
      { path: "blog/:id", lazy: page(() => import("@/routes/PostPage")) },
      { path: "write/:id?", lazy: protectedPage(() => import("@/routes/EditorPage")) },
      { path: "auth", lazy: page(() => import("@/routes/AuthPage")) },
      {
        path: "dashboard",
        lazy: protectedPage(() => import("@/routes/dashboard/DashboardLayout")),
        children: [
          { index: true, lazy: page(() => import("@/routes/dashboard/MyPostsPage")) },
          { path: "settings", lazy: page(() => import("@/routes/dashboard/SettingsPage")) },
        ],
      },
      { path: "about", lazy: page(() => import("@/routes/AboutPage")) },
      { path: "contact", lazy: page(() => import("@/routes/ContactPage")) },

      // Redirects from the old app's URLs so existing links keep working
      { path: "blogList", element: <Navigate to="/" replace /> },
      { path: "blogs", element: <Navigate to="/blog" replace /> },
      { path: "more/:id", element: <LegacyPostRedirect /> },
      { path: "about-us", element: <Navigate to="/about" replace /> },
      { path: "profile/*", element: <Navigate to="/dashboard" replace /> },

      { path: "*", lazy: page(() => import("@/routes/NotFoundPage")) },
    ],
  },
]);
