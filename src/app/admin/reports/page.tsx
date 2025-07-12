// This is a new file

'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Download, Users, BarChart3, MessageSquare } from 'lucide-react';

export default function AdminReportsPage() {
    const { toast } = useToast();

    const handleDownload = (reportName: string) => {
        toast({
            title: "Report Download Started",
            description: `The ${reportName} report is being generated and will download shortly.`,
        });
        // In a real app, this would trigger a server-side CSV generation.
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Download Reports</h1>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Users /> User Activity</CardTitle>
                        <CardDescription>Download a CSV of all users, their status, and join date.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={() => handleDownload('User Activity')}>
                            <Download className="mr-2" />
                            Download
                        </Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><BarChart3 /> Swap Statistics</CardTitle>
                        <CardDescription>Download a CSV of all swaps, including status, skills, and timestamps.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={() => handleDownload('Swap Statistics')}>
                             <Download className="mr-2" />
                            Download
                        </Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><MessageSquare /> Feedback Logs</CardTitle>
                        <CardDescription>Download a CSV containing all user feedback and ratings.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={() => handleDownload('Feedback Logs')}>
                             <Download className="mr-2" />
                            Download
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
