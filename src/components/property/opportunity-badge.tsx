import { Badge } from "@/components/ui/badge";
import { getOpportunityLabel } from "@/lib/opportunities";

export function OpportunityBadge({
  property,
  className,
}: {
  property?: { opportunityType?: string | null };
  className?: string;
}) {
  return (
    <Badge tone="accent" className={className}>
      {getOpportunityLabel(property)}
    </Badge>
  );
}
