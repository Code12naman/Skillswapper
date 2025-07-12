import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MapPin, Star } from 'lucide-react';
import type { UserProfile } from '@/lib/types';
import { SkillBadge } from './SkillBadge';

interface ProfileCardProps {
  user: UserProfile;
}

export function ProfileCard({ user }: ProfileCardProps) {
  return (
    <Card className="flex h-full flex-col overflow-hidden transition-all hover:shadow-lg">
      <CardHeader className="flex flex-row items-center gap-4 p-4">
        <Avatar className="h-16 w-16 border">
          <AvatarImage src={typeof user.profilePhotoUrl === 'string' ? user.profilePhotoUrl : user.profilePhotoUrl?.src} alt={user.name} data-ai-hint="profile picture" />
          <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <CardTitle className="text-lg font-bold">
            <Link href={`/users/${user.id}`} className="hover:underline">{user.name}</Link>
          </CardTitle>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {user.location && (
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{user.location}</span>
              </div>
            )}
             <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                <span>{user.ratings.average.toFixed(1)} ({user.ratings.count})</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-4 p-4 pt-0">
        <div>
          <h4 className="mb-2 text-sm font-semibold">Offers</h4>
          <div className="flex flex-wrap gap-2">
            {user.skillsOffered.slice(0, 3).map((skill) => (
              <SkillBadge key={skill} skill={skill} variant="offered" />
            ))}
          </div>
        </div>
        <div>
          <h4 className="mb-2 text-sm font-semibold">Wants</h4>
          <div className="flex flex-wrap gap-2">
            {user.skillsWanted.slice(0, 3).map((skill) => (
              <SkillBadge key={skill} skill={skill} variant="wanted" />
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full" asChild>
          <Link href={`/users/${user.id}/request-swap`}>Request Swap</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
