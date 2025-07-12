// This is a new file

'use client';

import { useAuth } from '@/hooks/use-auth';
import type { SkillSwap } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { ArrowRight } from 'lucide-react';

export default function AdminSwapsPage() {
    const { swaps } = useAuth();
    
    const getStatusVariant = (status: SkillSwap['status']) => {
        switch(status) {
            case 'accepted': return 'default';
            case 'rejected': return 'destructive';
            case 'pending': return 'secondary';
            default: return 'outline';
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Swap Monitoring</h1>
            <Card>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Swap Details</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {swaps.map((swap) => (
                            <TableRow key={swap.id}>
                                <TableCell>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={typeof swap.requesterPhotoUrl === 'string' ? swap.requesterPhotoUrl : undefined} />
                                                <AvatarFallback>{swap.requesterName.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="font-medium">{swap.requesterName}</div>
                                                <div className="text-xs text-muted-foreground">{swap.offeredSkill}</div>
                                            </div>
                                        </div>
                                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={typeof swap.receiverPhotoUrl === 'string' ? swap.receiverPhotoUrl : undefined} />
                                                <AvatarFallback>{swap.receiverName.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                             <div>
                                                <div className="font-medium">{swap.receiverName}</div>
                                                <div className="text-xs text-muted-foreground">{swap.requestedSkill}</div>
                                            </div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={getStatusVariant(swap.status)} className="capitalize">{swap.status}</Badge>
                                </TableCell>
                                <TableCell>
                                    {formatDistanceToNow(new Date(swap.createdAt), { addSuffix: true })}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        </div>
    );
}
