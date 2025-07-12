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
      className={cn(className, {
        'bg-green-800/20 border-green-700 text-green-400 hover:bg-green-800/40': variant === 'offered',
        'bg-sky-800/20 border-sky-700 text-sky-400 hover:bg-sky-800/40': variant === 'wanted',
      })}
    >
      {skill}
    </Badge>
  );
}
