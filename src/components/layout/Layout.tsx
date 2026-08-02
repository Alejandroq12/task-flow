import { Outlet } from 'react-router';

export function Layout() {
  return (
    <div>
      <header>Hello</header>

      <main>
        <Outlet />
      </main>
    </div>
  );
}