import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import type { UserProfile } from '@/lib/types';
import { SkillBadge } from './SkillBadge';

interface ProfileCardProps {
  user: UserProfile;
}

export function ProfileCard({ user }: ProfileCardProps) {
  return (
    <Card className="flex h-full flex-col overflow-hidden transition-all hover:shadow-lg hover:border-primary/50 bg-card">
      <CardHeader className="p-4">
        <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12 border">
                <AvatarImage src={typeof user.profilePhotoUrl === 'string' ? user.profilePhotoUrl : user.profilePhotoUrl?.src} alt={user.name} data-ai-hint="profile picture" />
                <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
                 <Link href={`/users/${user.id}`} className="font-bold hover:underline">{user.name}</Link>
                 <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                    <span>{user.ratings.average.toFixed(1)} ({user.ratings.count})</span>
                </div>
            </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-2 p-4 pt-0">
          <h4 className="mb-2 text-sm font-semibold text-muted-foreground">Offers</h4>
          <div className="flex flex-wrap gap-1">
            {user.skillsOffered.slice(0, 4).map((skill) => (
              <SkillBadge key={skill} skill={skill} variant="offered" />
            ))}
          </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full" asChild>
          <Link href={`/users/${user.id}`}>Request</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
