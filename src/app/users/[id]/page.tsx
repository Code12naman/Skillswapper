'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, MapPin, Star } from 'lucide-react';
import Link from 'next/link';
import { SkillBadge } from '@/components/profile/SkillBadge';
import { mockUsers } from '@/lib/mock-data';
import { notFound } from 'next/navigation';

export default function UserProfilePage({ params }: { params: { id: string } }) {
  const user = mockUsers.find(u => u.id === params.id);

  if (!user || !user.isPublic) {
    // In a real app, you might show a "This profile is private" message
    // For now, we'll just 404.
    notFound();
  }

  return (
    <div className="container mx-auto max-w-4xl py-12">
      <div className="flex flex-col items-center gap-8 md:flex-row md:items-start">
        <div className="flex w-full flex-col items-center gap-4 md:w-auto">
          <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
            <AvatarImage src={typeof user.profilePhotoUrl === 'string' ? user.profilePhotoUrl : user.profilePhotoUrl?.src} alt={user.name} data-ai-hint="profile avatar" />
            <AvatarFallback className="text-4xl">{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
           <Button className="w-full max-w-xs md:w-auto" asChild>
            <Link href={`/users/${user.id}/request-swap`}><ArrowRight className="mr-2 h-4 w-4" />Request Swap</Link>
          </Button>
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
        </div>
      </div>
    </div>
  );
}
