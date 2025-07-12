'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

export default function AdminMessagesPage() {
    const { toast } = useToast();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        toast({
            title: "Message Sent!",
            description: "Your platform-wide message has been broadcast.",
        });
        (e.target as HTMLFormElement).reset();
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Platform Messages</h1>
            <Card className="max-w-2xl">
                <CardHeader>
                    <CardTitle>Send a New Message</CardTitle>
                    <CardDescription>
                        Broadcast a message to all users on the platform. This could be for feature updates, downtime alerts, or community announcements.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="subject">Subject</Label>
                            <Input id="subject" placeholder="e.g., New Feature: User Reviews" required />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="message">Message</Label>
                            <Textarea id="message" placeholder="Type your message here..." required rows={6} />
                        </div>
                        <Button type="submit">Send Message</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
