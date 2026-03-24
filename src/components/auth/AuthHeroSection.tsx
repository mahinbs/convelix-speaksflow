import React from "react";
import { Sparkles, Phone, BarChart3, Target } from "lucide-react";
import { Logo } from "@/components/ui/logo";

const features = [
  {
    icon: Phone,
    title: "AI-Powered Calls",
    description: "Autonomous outbound dialing at scale, 24/7.",
  },
  {
    icon: BarChart3,
    title: "Real-Time Analytics",
    description: "Live campaign performance and conversion tracking.",
  },
  {
    icon: Target,
    title: "Smart Lead Scoring",
    description: "AI intent classification prioritizes your best leads.",
  },
];

export const AuthHeroSection: React.FC = () => {
  return (
    <div className="relative flex min-h-[280px] lg:min-h-screen w-full flex-col bg-brand-600 text-primary-foreground lg:justify-center overflow-hidden">
      {/* Subtle grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.45) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.45) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
        aria-hidden
      />
      {/* Soft vignette */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-400 via-brand-500 to-brand-500" aria-hidden />

      <div className="relative z-10 flex flex-1 flex-col px-6 pb-10 pt-10 sm:px-10 lg:px-14 lg:py-16 lg:pt-9">
        <div className="mb-10 lg:mb-14">
          <Logo size="lg" className="justify-start" />
        </div>

        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm sm:text-sm">
          <Sparkles className="h-3.5 w-3.5 shrink-0 text-white/90 sm:h-4 sm:w-4" />
          AI-Native Sales Intelligence Platform
        </div>

        <h1 className="mt-8 max-w-xl text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
          Convert leads into revenue, automatically.
        </h1>

        <p className="mt-5 max-w-lg text-base leading-relaxed text-white/85 sm:text-lg">
          Convelix&apos;s AI agents handle every outbound call, qualify intent,
          and update your CRM — so your team only talks to buyers who are ready.
        </p>

        <ul className="mt-10 space-y-5 lg:mt-12">
          {features.map(({ icon: Icon, title, description }) => (
            <li key={title} className="flex gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-white/15 bg-white/10 backdrop-blur-sm">
                <Icon className="h-5 w-5 text-white" strokeWidth={1.75} />
              </div>
              <div>
                <p className="font-semibold text-white">{title}</p>
                <p className="mt-0.5 text-sm text-white/75">{description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
