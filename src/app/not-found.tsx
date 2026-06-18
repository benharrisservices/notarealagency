import Link from "next/link";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="font-display text-7xl text-accent">404</p>
      <h1 className="mt-4 font-display text-3xl text-ink">We couldn&rsquo;t find that page</h1>
      <p className="mt-3 max-w-md text-muted">The page may have moved, or the property may no longer be available.</p>
      <div className="mt-8 flex gap-3">
        <ButtonLink href="/" variant="primary">Back to home</ButtonLink>
        <ButtonLink href="/properties" variant="outline">Browse properties</ButtonLink>
      </div>
    </Container>
  );
}
