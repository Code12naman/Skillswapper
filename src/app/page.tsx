import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { ProfileCard } from '@/components/profile/ProfileCard';
import { mockUsers } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';

export default function Home() {
  const publicProfiles = mockUsers.filter(user => user.isPublic);

  return (
    <div className="container mx-auto py-8">
      <section className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
          Learn, Teach, and Grow Together
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          Join a community of learners and experts. Swap your skills, expand your knowledge, and connect with peers.
        </p>
      </section>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Search for skills like 'Photoshop', 'React', etc." 
            className="w-full pl-10"
          />
        </div>
        <Button>Search</Button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {publicProfiles.map((user) => (
          <ProfileCard key={user.id} user={user} />
        ))}
      </div>
      
      <div className="mt-12 flex justify-center">
        <Button variant="outline">Load More</Button>
      </div>
    </div>
  );
}
