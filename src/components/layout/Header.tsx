'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, User, Home, Repeat, ShieldCheck } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function Header() {
  const { user, loading, logout, isClient } = useAuth();
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/swaps', label: 'Swap Requests', icon: Repeat, auth: true },
  ];
  
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <div className="mr-6 flex items-center">
          <Link href="/" className="text-xl font-bold transition-colors hover:text-primary">Skill Swap Platform</Link>
        </div>
        
        <nav className="flex flex-1 items-center gap-2">
            {navLinks.map(link => {
                if (link.auth && !user) return null;
                const isActive = pathname === link.href;
                return (
                    <Button key={link.href} variant={isActive ? "secondary" : "ghost"} asChild>
                        <Link href={link.href} className={cn(isActive && "font-bold")}>{link.label}</Link>
                    </Button>
                )
            })}
        </nav>

        <div className="flex flex-1 items-center justify-end gap-4">
            {(loading || !isClient) ? (
              <Skeleton className="h-10 w-10 rounded-full" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full transition-transform hover:scale-105">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={typeof user.profilePhotoUrl === 'string' ? user.profilePhotoUrl : undefined} alt={user.name} data-ai-hint="profile avatar" />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {user.role === 'admin' && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin"><ShieldCheck className="mr-2 h-4 w-4" />Admin Dashboard</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link href="/profile"><User className="mr-2 h-4 w-4" />Profile</Link>
                  </DropdownMenuItem>
                   <DropdownMenuItem asChild>
                     <Link href="/swaps"><Repeat className="mr-2 h-4 w-4" />Swap Requests</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
                <Button asChild>
                  <Link href="/login">Login</Link>
                </Button>
            )}
        </div>
      </div>
    </header>
  );
}