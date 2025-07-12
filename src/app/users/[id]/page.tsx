'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, MapPin, Star, MessageSquarePlus } from 'lucide-react';
import { SkillBadge } from '@/components/profile/SkillBadge';
import { mockUsers } from '@/lib/mock-data';
import { notFound, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import { SwapRequestForm } from '@/components/swaps/SwapRequestForm';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function UserProfilePage({ params }: { params: { id: string } }) {
  const { user: currentUser, loading: authLoading } = useAuth();
  const router = useRouter();
  const user = mockUsers.find(u => u.id === params.id);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!user || !user.isPublic) {
    notFound();
  }

  if (isClient && authLoading) {
    return (
        <div className="container mx-auto max-w-4xl py-12">
            <div className="flex flex-col items-center gap-8 md:flex-row md:items-start">
            <div className="flex w-full flex-col items-center gap-4 md:w-auto">
                <Skeleton className="h-32 w-32 rounded-full" />
                <Skeleton className="h-10 w-40" />
            </div>
            <div className="flex-1 space-y-6">
                <Skeleton className="h-10 w-1/2" />
                <Skeleton className="h-6 w-3/4" />
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Card><CardHeader><Skeleton className="h-6 w-1/3" /></CardHeader><CardContent><Skeleton className="h-20 w-full" /></CardContent></Card>
                <Card><CardHeader><Skeleton className="h-6 w-1/3" /></CardHeader><CardContent><Skeleton className="h-20 w-full" /></CardContent></Card>
                </div>
            </div>
            </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl py-12">
      <div className="flex flex-col items-center gap-8 md:flex-row md:items-start">
        <div className="flex w-full flex-col items-center gap-4 md:w-auto">
          <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
            <AvatarImage src={typeof user.profilePhotoUrl === 'string' ? user.profilePhotoUrl : user.profilePhotoUrl?.src} alt={user.name} data-ai-hint="profile avatar" />
            <AvatarFallback className="text-4xl">{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
           <Dialog>
            <DialogTrigger asChild>
                <Button className="w-full max-w-xs md:w-auto">
                    <MessageSquarePlus className="mr-2 h-4 w-4" /> Request Swap
                </Button>
            </DialogTrigger>
            {isClient && (
                <DialogContent className="sm:max-w-[625px]">
                    <DialogHeader>
                        <DialogTitle>Request a Skill Swap with {user.name}</DialogTitle>
                        <DialogDescription>Select the skills you&apos;d like to trade.</DialogDescription>
                    </DialogHeader>
                    {currentUser ? (
                         <SwapRequestForm currentUser={currentUser} otherUser={user} />
                    ) : (
                        <div className="flex flex-col items-center justify-center gap-4 py-8">
                            <p>You need to be logged in to request a swap.</p>
                            <Button onClick={() => router.push(`/login?redirect=/users/${user.id}`)}>Login</Button>
                        </div>
                    )}
                </DialogContent>
            )}
           </Dialog>
        </div>
        <div className="flex-1 space-y-6">
          <div>
            <h1 className="text-4xl font-bold">{user.name}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-2 text-muted-foreground">
              {user.location && <p className="flex items-center gap-2"><MapPin className="h-4 w-4" />{user.location}</p>}
              <p className="flex items-center gap-2"><Star className="h-4 w-4 text-amber-400 fill-amber-400" />{user.ratings.average.toFixed(1)} ({user.ratings.count} ratings)</p>
            </div>
          </div>
          {user.bio && <p className="text-lg">{user.bio}</p>}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card>
              <CardHeader><CardTitle>Skills Offered</CardTitle></CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {user.skillsOffered.map(skill => <SkillBadge key={skill} skill={skill} variant="offered"/>)}
              </CardContent>
            </Card>
             <Card>
              <CardHeader><CardTitle>Skills Wanted</CardTitle></CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {user.skillsWanted.map(skill => <SkillBadge key={skill} skill={skill} variant="wanted"/>)}
              </CardContent>
            </Card>
          </div>
           <Card>
              <CardHeader>
                <CardTitle>Rating and Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">No feedback yet.</p>
              </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
