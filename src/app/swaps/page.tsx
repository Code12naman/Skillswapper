'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ArrowRight, Check, X } from 'lucide-react';
import { mockSwaps } from '@/lib/mock-data';
import { formatDistanceToNow } from 'date-fns';
import type { SkillSwap } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function SwapsPage() {
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
        <Skeleton className="mb-8 h-10 w-1/3" />
        <div className="space-y-4">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  const incomingRequests = mockSwaps.filter(swap => swap.receiverId === user.id);
  const outgoingRequests = mockSwaps.filter(swap => swap.requesterId === user.id);
  
  const SwapCard = ({ swap }: { swap: SkillSwap }) => {
    const isRequester = swap.requesterId === user.id;
    const otherPerson = isRequester ? 
      { name: swap.receiverName, photo: swap.receiverPhotoUrl } :
      { name: swap.requesterName, photo: swap.requesterPhotoUrl };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between p-4">
                <div className="flex items-center gap-3">
                    <Avatar>
                        <AvatarImage src={typeof otherPerson.photo === 'string' ? otherPerson.photo : otherPerson.photo?.src} alt={otherPerson.name} />
                        <AvatarFallback>{otherPerson.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="font-semibold">{otherPerson.name}</div>
                </div>
                 <div className="text-xs text-muted-foreground">
                    {formatDistanceToNow(swap.createdAt, { addSuffix: true })}
                </div>
            </CardHeader>
            <CardContent className="space-y-4 p-4 pt-0">
                <div className="flex items-center justify-around rounded-lg bg-muted p-3 text-center">
                    <div>
                        <p className="text-sm text-muted-foreground">{isRequester ? "You Offer" : "They Offer"}</p>
                        <p className="font-bold">{swap.offeredSkill}</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground" />
                    <div>
                        <p className="text-sm text-muted-foreground">{isRequester ? "You Request" : "They Request"}</p>
                        <p className="font-bold">{swap.requestedSkill}</p>
                    </div>
                </div>
                {swap.message && <p className="text-sm text-muted-foreground p-3 border rounded-lg">"{swap.message}"</p>}
                
                {swap.status === 'pending' && (
                    <div className="flex gap-2">
                        {isRequester ? (
                            <Button variant="outline" className="w-full">Cancel Request</Button>
                        ) : (
                            <>
                                <Button variant="destructive" className="w-full"><X className="mr-2 h-4 w-4" />Reject</Button>
                                <Button className="w-full"><Check className="mr-2 h-4 w-4" />Accept</Button>
                            </>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    )
  }

  return (
    <div className="container mx-auto max-w-4xl py-12">
      <h1 className="mb-8 text-4xl font-bold">My Skill Swaps</h1>
      <Tabs defaultValue="incoming">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="incoming">Incoming Requests ({incomingRequests.length})</TabsTrigger>
          <TabsTrigger value="outgoing">Outgoing Requests ({outgoingRequests.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="incoming">
            <div className="space-y-4 pt-4">
                {incomingRequests.length > 0 ? (
                    incomingRequests.map(swap => <SwapCard key={swap.id} swap={swap} />)
                ) : (
                    <p className="py-8 text-center text-muted-foreground">No incoming requests yet.</p>
                )}
            </div>
        </TabsContent>
        <TabsContent value="outgoing">
             <div className="space-y-4 pt-4">
                {outgoingRequests.length > 0 ? (
                    outgoingRequests.map(swap => <SwapCard key={swap.id} swap={swap} />)
                ) : (
                    <p className="py-8 text-center text-muted-foreground">You haven't made any requests yet.</p>
                )}
            </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
