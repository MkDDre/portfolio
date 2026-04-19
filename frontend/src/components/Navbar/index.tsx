// src/components/Navbar/index.tsx
import * as React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuthContext } from '../../contexts/useAuthContext';
import { useCartContext } from '../../contexts/useCartContext';

const linkClassName = ({ isActive }: { isActive: boolean }) =>
  `text-sm transition-colors ${isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`;

const NavBar: React.FC = () => {
  const { isAuthenticated, clearUser, authenticatedUser } = useAuthContext();
  const { lines } = useCartContext();

  return (
    <nav className="sticky top-0 z-30 w-full border-b bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-lg font-semibold tracking-tight">
            Portfolio Services
          </Link>
          <div className="hidden items-center gap-4 md:flex">
            <NavLink to="/" className={linkClassName} end>
              Accueil
            </NavLink>
            <NavLink to="/cart" className={linkClassName}>
              Panier
            </NavLink>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <NavLink to="/cart" className="gap-2">
              <ShoppingCart className="size-4" />
              Panier
              <Badge variant="secondary">{lines.length}</Badge>
            </NavLink>
          </Button>

          {isAuthenticated ? (
            <>
              <span className="hidden text-xs text-muted-foreground sm:inline">
                {authenticatedUser?.email}
              </span>
              <Button variant="ghost" size="sm" onClick={clearUser}>
                Deconnexion
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <NavLink to="/login">Connexion</NavLink>
              </Button>
              <Button size="sm" asChild>
                <NavLink to="/register">Inscription</NavLink>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
