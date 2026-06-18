"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { ArchitecturalMotif } from "./architectural-motif";

const ease = [0.16, 0.84, 0.44, 1] as const;
const rise = (delay: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease, delay },
});

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-line bg-paper">
      <Container className="relative grid min-h-[78vh] items-center gap-10 py-24 lg:grid-cols-[1.12fr_0.88fr] lg:gap-16">
        <div className="max-w-2xl">
          <motion.p
            {...rise(0)}
            className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-accent"
          >
            NARA — Not A Real Agency
          </motion.p>

          <motion.h1
            {...rise(0.08)}
            className="mt-6 font-display text-[2.7rem] leading-[1.04] text-ink sm:text-6xl lg:text-[4.4rem]"
          >
            An edited index of London property opportunities.
          </motion.h1>

          <motion.p
            {...rise(0.16)}
            className="mt-7 max-w-xl text-lg leading-relaxed text-muted"
          >
            NARA brings curation, better information and earlier access to residential, development,
            commercial and off-market opportunities across London.
          </motion.p>

          <motion.div {...rise(0.24)} className="mt-9 flex flex-wrap gap-3">
            <ButtonLink href="/properties" variant="primary" size="lg">
              View opportunities
            </ButtonLink>
            <ButtonLink href="/about" variant="outline" size="lg">
              How NARA works
            </ButtonLink>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.1, ease, delay: 0.2 }}
          className="pointer-events-none relative hidden lg:block"
        >
          <ArchitecturalMotif className="text-ink/15" />
        </motion.div>
      </Container>
    </section>
  );
}
