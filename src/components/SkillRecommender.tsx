'use client';

import { useState } from 'react';
import { recommendSkills, RecommendSkillsInput } from '@/ai/flows/skill-recommendation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';
import { SkillBadge } from '@/components/profile/SkillBadge';
import { useToast } from '@/hooks/use-toast';

interface SkillRecommenderProps {
  currentSkills: string[];
  interests: string[];
}

export function SkillRecommender({ currentSkills, interests }: SkillRecommenderProps) {
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleGetRecommendations = async () => {
    setLoading(true);
    setRecommendations([]);
    try {
      const input: RecommendSkillsInput = {
        existingSkills: currentSkills,
        interests: interests,
      };
      const result = await recommendSkills(input);
      setRecommendations(result.recommendedSkills);
    } catch (error) {
      console.error('Skill recommendation failed:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not fetch skill recommendations. Please try again later.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="text-amber-400" />
              Discover New Skills
            </CardTitle>
            <CardDescription>
              Get AI-powered recommendations based on your profile.
            </CardDescription>
          </div>
          <Button onClick={handleGetRecommendations} disabled={loading} className="w-full md:w-auto">
            {loading ? 'Thinking...' : 'Get Suggestions'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="flex gap-2">
            <div className="h-6 w-24 animate-pulse rounded-full bg-muted-foreground/20"></div>
            <div className="h-6 w-32 animate-pulse rounded-full bg-muted-foreground/20"></div>
            <div className="h-6 w-20 animate-pulse rounded-full bg-muted-foreground/20"></div>
          </div>
        )}
        {recommendations.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {recommendations.map((skill, index) => (
              <SkillBadge key={index} skill={skill} variant="offered" className="text-base"/>
            ))}
          </div>
        )}
        {!loading && recommendations.length === 0 && (
            <p className="text-sm text-muted-foreground">Click the button to find new skills to learn or offer!</p>
        )}
      </CardContent>
    </Card>
  );
}
