'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Edit, MapPin, Star, UserCheck, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { SkillBadge } from '@/components/profile/SkillBadge';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="container mx-auto max-w-4xl py-12">
        <div className="flex flex-col items-center gap-8 md:flex-row md:items-start">
          <div className="flex flex-col items-center gap-4">
            <Skeleton className="h-32 w-32 rounded-full" />
            <Skeleton className="h-10 w-32" />
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
       <Card>
        <CardContent className="p-6">
            <div className="flex flex-col items-center gap-8 md:flex-row md:items-start">
                <div className="flex flex-col items-center gap-4">
                    <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
                        <AvatarImage src={typeof user.profilePhotoUrl === 'string' ? user.profilePhotoUrl : user.profilePhotoUrl?.src} alt={user.name} data-ai-hint="profile avatar" />
                        <AvatarFallback className="text-4xl">{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                </div>
                <div className="flex-1 space-y-2 w-full text-center md:text-left">
                    <div className='flex items-center justify-center md:justify-between'>
                        <h1 className="text-3xl font-bold">{user.name}</h1>
                        <Button asChild>
                            <Link href="/profile/edit"><Edit className="mr-2 h-4 w-4"/>Edit Profile</Link>
                        </Button>
                    </div>
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
                    <CardHeader><CardTitle>Skills I Offer</CardTitle></CardHeader>
                    <CardContent className="flex flex-wrap gap-2">
                        {user.skillsOffered.map(skill => <SkillBadge key={skill} skill={skill} variant="offered"/>)}
                    </CardContent>
                </Card>
                <Card className="bg-card/50">
                    <CardHeader><CardTitle>Skills I Want</CardTitle></CardHeader>
                    <CardContent className="flex flex-wrap gap-2">
                        {user.skillsWanted.map(skill => <SkillBadge key={skill} skill={skill} variant="wanted"/>)}
                    </CardContent>
                </Card>
            </div>
             <Separator className='my-8' />
             <div className="space-y-4">
                <h3 className="text-lg font-semibold">Settings</h3>
                <div className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                        <Label htmlFor="public-profile" className="font-bold">Public Profile</Label>
                        <p className="text-sm text-muted-foreground">Make your profile visible to others on the platform.</p>
                    </div>
                    <Switch id="public-profile" checked={user.isPublic} />
                </div>
                 <div className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                        <Label htmlFor="availability" className="font-bold">Availability</Label>
                        <p className="text-sm text-muted-foreground">Let others know when you are generally available to swap.</p>
                    </div>
                    <p className='font-mono text-sm bg-muted px-2 py-1 rounded-md'>{user.availability.join(', ')}</p>
                </div>
             </div>
        </CardContent>
       </Card>
    </div>
  );
}
