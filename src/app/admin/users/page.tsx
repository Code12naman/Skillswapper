// This is a new file

'use client';

import { useAuth } from '@/hooks/use-auth';
import type { UserProfile } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Ban, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AdminUsersPage() {
    const { users, updateUser, user: adminUser } = useAuth();
    const { toast } = useToast();

    const handleToggleBan = (userToUpdate: UserProfile) => {
        if (userToUpdate.id === adminUser?.id) {
            toast({ variant: 'destructive', title: "Error", description: "You cannot ban yourself." });
            return;
        }
        const newStatus = userToUpdate.status === 'banned' ? 'active' : 'banned';
        updateUser({ ...userToUpdate, status: newStatus });
        toast({
            title: `User ${newStatus === 'banned' ? 'Banned' : 'Unbanned'}`,
            description: `${userToUpdate.name} has been ${newStatus}.`,
        });
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">User Management</h1>
            <Card>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar>
                                            <AvatarImage src={typeof user.profilePhotoUrl === 'string' ? user.profilePhotoUrl : undefined} alt={user.name} />
                                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="font-medium">{user.name}</div>
                                    </div>
                                </TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    <Badge variant={user.status === 'active' ? 'default' : 'destructive'}>
                                        {user.status === 'active' ? <CheckCircle2 className="mr-2 h-3 w-3" /> : <Ban className="mr-2 h-3 w-3" />}
                                        {user.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="capitalize">{user.role}</TableCell>
                                <TableCell className="text-right">
                                    <Button 
                                        variant={user.status === 'banned' ? 'secondary' : 'destructive'}
                                        size="sm"
                                        onClick={() => handleToggleBan(user)}
                                        disabled={user.id === adminUser?.id}
                                    >
                                        <Ban className="mr-2 h-4 w-4" />
                                        {user.status === 'banned' ? 'Unban' : 'Ban'}
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        </div>
    );
}
