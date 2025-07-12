'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, MapPin, Star, UserCheck } from 'lucide-react';
import Link from 'next/link';
import { SkillBadge } from '@/components/profile/SkillBadge';
import { SkillRecommender } from '@/components/SkillRecommender';
import { Skeleton } from '@/components/ui/skeleton';

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
      <div className="flex flex-col items-center gap-8 md:flex-row md:items-start">
        <div className="flex flex-col items-center gap-4">
          <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
            <AvatarImage src={typeof user.profilePhotoUrl === 'string' ? user.profilePhotoUrl : user.profilePhotoUrl?.src} alt={user.name} data-ai-hint="profile avatar" />
            <AvatarFallback className="text-4xl">{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <Button asChild>
            <Link href="/profile/edit"><Edit className="mr-2 h-4 w-4"/>Edit Profile</Link>
          </Button>
        </div>
        <div className="flex-1 space-y-6">
          <div>
            <h1 className="text-4xl font-bold">{user.name}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-2 text-muted-foreground">
              {user.location && <p className="flex items-center gap-2"><MapPin className="h-4 w-4" />{user.location}</p>}
              <p className="flex items-center gap-2"><Star className="h-4 w-4 text-amber-400 fill-amber-400" />{user.ratings.average.toFixed(1)} ({user.ratings.count} ratings)</p>
              <p className="flex items-center gap-2"><UserCheck className="h-4 w-4" />{user.isPublic ? 'Public Profile' : 'Private Profile'}</p>
            </div>
          </div>
          {user.bio && <p className="text-lg">{user.bio}</p>}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card>
              <CardHeader><CardTitle>Skills I Offer</CardTitle></CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {user.skillsOffered.map(skill => <SkillBadge key={skill} skill={skill} variant="offered"/>)}
              </CardContent>
            </Card>
             <Card>
              <CardHeader><CardTitle>Skills I Want</CardTitle></CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {user.skillsWanted.map(skill => <SkillBadge key={skill} skill={skill} variant="wanted"/>)}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <div className="mt-12">
        <SkillRecommender 
            currentSkills={user.skillsOffered}
            interests={user.skillsWanted}
        />
      </div>
    </div>
  );
}
