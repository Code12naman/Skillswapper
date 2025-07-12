'use client';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import type { UserProfile, SkillSwap } from '@/lib/types';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

const formSchema = z.object({
  offeredSkill: z.string().min(1, { message: 'Please select a skill to offer.' }),
  requestedSkill: z.string().min(1, { message: 'Please select a skill to request.' }),
  message: z.string().optional(),
});

interface SwapRequestFormProps {
  currentUser: UserProfile;
  otherUser: UserProfile;
}

export function SwapRequestForm({ currentUser, otherUser }: SwapRequestFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { addSwap } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      offeredSkill: '',
      requestedSkill: '',
      message: `Hi ${otherUser.name.split(' ')[0]}, I'd love to swap skills with you!`,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const newSwap: SkillSwap = {
      id: `swap_${new Date().getTime()}`,
      requesterId: currentUser.id,
      requesterName: currentUser.name,
      requesterPhotoUrl: currentUser.profilePhotoUrl,
      receiverId: otherUser.id,
      receiverName: otherUser.name,
      receiverPhotoUrl: otherUser.profilePhotoUrl,
      offeredSkill: values.offeredSkill,
      requestedSkill: values.requestedSkill,
      message: values.message || '',
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    addSwap(newSwap);
    
    toast({
      title: 'Swap Request Sent!',
      description: `Your request to swap skills with ${otherUser.name} has been sent.`,
    });
    router.push('/swaps');
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-end">
          <FormField
            control={form.control}
            name="offeredSkill"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>You Offer</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a skill you offer" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {currentUser.skillsOffered.map((skill) => (
                      <SelectItem key={skill} value={skill}>
                        {skill}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="text-muted-foreground shrink-0 p-2">
            <ArrowRight className="h-6 w-6" />
          </div>

          <FormField
            control={form.control}
            name="requestedSkill"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>You Request</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={`Select a skill ${otherUser.name} offers`} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {otherUser.skillsOffered.map((skill) => (
                      <SelectItem key={skill} value={skill}>
                        {skill}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message (Optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Add a personal message to your request..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Send Swap Request
        </Button>
      </form>
    </Form>
  );
}
