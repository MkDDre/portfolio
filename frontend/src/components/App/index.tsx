// src/components/App/index.tsx
import NavBar from '../Navbar';
import Footer from '../Footer';
import { Outlet } from 'react-router-dom';

const App = () => {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,_hsl(var(--primary-foreground))_0%,_hsl(var(--background))_35%)] flex flex-col">
      <NavBar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default App;
