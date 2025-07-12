import Link from 'next/link';
import { BotMessageSquare } from 'lucide-react';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2" prefetch={false}>
      <BotMessageSquare className="h-8 w-8 text-primary" />
      <span className="text-xl font-bold tracking-tight text-foreground">SkillSwapper</span>
    </Link>
  );
}
