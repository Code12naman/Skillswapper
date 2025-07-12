'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowRight, MapPin, Star, MessageSquarePlus, CheckCircle2 } from 'lucide-react';
import { SkillBadge } from '@/components/profile/SkillBadge';
import { mockUsers } from '@/lib/mock-data';
import { notFound, useRouter, useParams } from 'next/navigation';
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
import { Separator } from '@/components/ui/separator';

export default function UserProfilePage() {
  const params = useParams();
  const { user: currentUser, loading: authLoading } = useAuth();
  const router = useRouter();
  const id = typeof params.id === 'string' ? params.id : '';
  const user = mockUsers.find(u => u.id === id);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!user || !user.isPublic) {
    notFound();
  }

  if (isClient && authLoading) {
    return (
        <div className="container mx-auto max-w-4xl py-12 px-4">
            <Skeleton className="h-64 w-full" />
        </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl py-12 px-4">
        <Card>
            <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col items-center gap-6 text-center md:flex-row md:items-start md:text-left">
                    <div className="flex w-full flex-col items-center gap-4 md:w-auto">
                        <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
                            <AvatarImage src={typeof user.profilePhotoUrl === 'string' ? user.profilePhotoUrl : undefined} alt={user.name} data-ai-hint="profile avatar" />
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
                    <div className="flex-1 space-y-2 w-full">
                        <h1 className="text-3xl font-bold">{user.name}</h1>
                        {user.location && <p className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground"><MapPin className="h-4 w-4" />{user.location}</p>}
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-2 text-muted-foreground">
                            <p className="flex items-center gap-2"><Star className="h-4 w-4 text-amber-400 fill-amber-400" />{user.ratings.average.toFixed(1)} ({user.ratings.count} ratings)</p>
                            <p className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" />Verified</p>
                        </div>
                        {user.bio && <p className="text-base pt-4">{user.bio}</p>}
                    </div>
                </div>

                 <Separator className='my-8' />
                
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <Card className="bg-card/50">
                        <CardHeader><CardTitle>Skills Offered</CardTitle></CardHeader>
                        <CardContent className="flex flex-wrap gap-2">
                            {user.skillsOffered.map(skill => <SkillBadge key={skill} skill={skill} variant="offered"/>)}
                        </CardContent>
                    </Card>
                    <Card className="bg-card/50">
                        <CardHeader><CardTitle>Skills Wanted</CardTitle></CardHeader>
                        <CardContent className="flex flex-wrap gap-2">
                            {user.skillsWanted.map(skill => <SkillBadge key={skill} skill={skill} variant="wanted"/>)}
                        </CardContent>
                    </Card>
                </div>

                <Separator className='my-8' />

                <Card className="bg-card/50">
                    <CardHeader>
                        <CardTitle>Rating and Feedback</CardTitle>
                        <CardDescription>See what others have to say.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">No feedback yet.</p>
                    </CardContent>
                </Card>
            </CardContent>
        </Card>
    </div>
  );
}
