import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface SkillBadgeProps {
  skill: string;
  variant?: 'offered' | 'wanted';
  className?: string;
}

export function SkillBadge({ skill, variant = 'offered', className }: SkillBadgeProps) {
  return (
    <Badge
      variant={variant === 'offered' ? 'default' : 'secondary'}
      className={cn('bg-opacity-80', className)}
    >
      {skill}
    </Badge>
  );
}
