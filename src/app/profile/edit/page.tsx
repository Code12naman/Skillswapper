'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

export default function EditProfilePage() {
  const { user, loading, updateUser } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [skillsOffered, setSkillsOffered] = useState('');
  const [skillsWanted, setSkillsWanted] = useState('');
  
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
    if (user) {
      setName(user.name);
      setBio(user.bio || '');
      setSkillsOffered(user.skillsOffered.join(', '));
      setSkillsWanted(user.skillsWanted.join(', '));
    }
  }, [user, loading, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const offeredArray = skillsOffered.split(',').map(s => s.trim()).filter(Boolean);
    const wantedArray = skillsWanted.split(',').map(s => s.trim()).filter(Boolean);

    updateUser({
      name,
      bio,
      skillsOffered: offeredArray,
      skillsWanted: wantedArray,
    });
    
    toast({
      title: 'Profile Updated',
      description: 'Your changes have been saved successfully.',
    });
    router.push('/profile');
  };

  if (loading || !user) {
    return (
      <div className="container mx-auto max-w-2xl py-12">
        <Skeleton className="h-8 w-48 mb-8" />
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-6">
              <Skeleton className="h-24 w-24 rounded-full" />
              <div className="flex-grow space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
            <div className="mt-6 space-y-6">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-32 ml-auto" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl py-12">
      <h1 className="text-3xl font-bold mb-8">Edit Profile</h1>
      <form onSubmit={handleSubmit}>
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={typeof user.profilePhotoUrl === 'string' ? user.profilePhotoUrl : user.profilePhotoUrl?.src} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                 <Button size="sm" className="absolute -bottom-2 -right-2 rounded-full">Edit</Button>
              </div>
              <div className="w-full space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
            </div>
            
            <div className="mt-6 space-y-4">
              <div>
                <Label htmlFor="bio">Your Bio</Label>
                <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell everyone a little about yourself..." />
              </div>
              <div>
                <Label htmlFor="skillsOffered">Skills you can offer</Label>
                <Input id="skillsOffered" value={skillsOffered} onChange={(e) => setSkillsOffered(e.target.value)} placeholder="e.g. React, Photography, Public Speaking" />
                 <p className="text-sm text-muted-foreground mt-1">Separate skills with a comma.</p>
              </div>
               <div>
                <Label htmlFor="skillsWanted">Skills you want to learn</Label>
                <Input id="skillsWanted" value={skillsWanted} onChange={(e) => setSkillsWanted(e.target.value)} placeholder="e.g. Node.js, Photo Editing, SEO" />
                 <p className="text-sm text-muted-foreground mt-1">Separate skills with a comma.</p>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <Button type="submit">Save Changes</Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
