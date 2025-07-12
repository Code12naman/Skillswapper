'use client';

import { notFound, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { mockUsers } from '@/lib/mock-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SwapRequestForm } from '@/components/swaps/SwapRequestForm';
import { useEffect } from 'react';

export default function RequestSwapPage({ params }: { params: { id: string } }) {
  const { user: currentUser, loading: authLoading } = useAuth();
  const router = useRouter();
  const otherUser = mockUsers.find((u) => u.id === params.id);

  useEffect(() => {
    if (!authLoading && !currentUser) {
      router.push('/login');
    }
  }, [currentUser, authLoading, router]);

  if (!otherUser || !otherUser.isPublic) {
    notFound();
  }
  
  if (authLoading || !currentUser) {
      return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto max-w-2xl py-12">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={typeof otherUser.profilePhotoUrl === 'string' ? otherUser.profilePhotoUrl : otherUser.profilePhotoUrl?.src} alt={otherUser.name} />
              <AvatarFallback>{otherUser.name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">Request a Skill Swap with {otherUser.name}</CardTitle>
              <CardDescription>Select the skills you&apos;d like to trade.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <SwapRequestForm currentUser={currentUser} otherUser={otherUser} />
        </CardContent>
      </Card>
    </div>
  );
}
