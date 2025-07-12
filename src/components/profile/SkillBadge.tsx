import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface SkillBadgeProps {
  skill: string;
  variant?: 'offered' | 'wanted';
  className?: string;
}

export function SkillBadge({ skill, variant, className }: SkillBadgeProps) {
  return (
    <Badge
      variant={variant === 'wanted' ? 'secondary' : 'default'}
      className={cn(className)}
    >
      {skill}
    </Badge>
  );
}
