import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { Preloader } from './Preloader';

export function Layout() {
  return (
    <>
      <Preloader />
      <div className="bg-layer" aria-hidden="true">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
        <div className="blob blob-4"></div>
        <div className="dot-grid"></div>
      </div>
      <Navbar />
      <main className="flex-1 pt-[calc(64px+12px+2.25rem)] pb-12">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
