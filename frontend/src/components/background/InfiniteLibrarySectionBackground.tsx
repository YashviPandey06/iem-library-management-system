import React from 'react';
import { DistantFloatingBook } from './DistantFloatingBook';
import { DriftingParchmentPage } from './DriftingParchmentPage';
import { GoldenDustCanvas } from '../GoldenDustCanvas';

export type LibrarySectionVariant = 'hero' | 'stats' | 'holdings' | 'infrastructure' | 'workflow' | 'footer' | 'catalog';

interface InfiniteLibrarySectionBackgroundProps {
  variant: LibrarySectionVariant;
  className?: string;
  children?: React.ReactNode;
}

export const InfiniteLibrarySectionBackground: React.FC<InfiniteLibrarySectionBackgroundProps> = ({
  variant,
  className = '',
  children,
}) => {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* ==============================================================
          LAYER 1: ATMOSPHERIC MULTI-RADIAL LIGHTING BASE
          ============================================================== */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Deep base gradient depending on section variant */}
        {variant === 'hero' && (
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(circle at 18% 28%, #1A3328 0%, #11231B 45%, #0A1611 100%)',
            }}
          />
        )}

        {variant === 'stats' && (
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(circle at 50% 30%, #15271F 0%, #0F1E17 50%, #09130F 100%)',
            }}
          />
        )}

        {variant === 'holdings' && (
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(circle at 75% 20%, #1B362B 0%, #12241D 40%, #0B1612 100%)',
            }}
          />
        )}

        {variant === 'infrastructure' && (
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(circle at 30% 50%, #162B21 0%, #0E1B15 50%, #08110D 100%)',
            }}
          />
        )}

        {variant === 'workflow' && (
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(circle at 50% 60%, #172F24 0%, #102119 50%, #0A1510 100%)',
            }}
          />
        )}

        {variant === 'footer' && (
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(180deg, #0C1712 0%, #070E0B 100%)',
            }}
          />
        )}

        {variant === 'catalog' && (
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(circle at 50% 15%, #183327 0%, #10231B 50%, #0A1611 100%)',
            }}
          />
        )}

        {/* Ambient Moving Gold Lighting Aura (Layer 5) */}
        <div
          className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full animate-aura-1 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle, rgba(195, 166, 107, 0.14) 0%, rgba(195, 166, 107, 0.04) 45%, transparent 70%)',
            filter: 'blur(45px)',
          }}
        />

        {/* Secondary Shifting Olive/Terracotta Aura (Layer 5) */}
        <div
          className="absolute -bottom-40 right-[-10%] w-[680px] h-[680px] rounded-full animate-aura-2 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle, rgba(166, 95, 69, 0.09) 0%, rgba(38, 61, 50, 0.15) 50%, transparent 75%)',
            filter: 'blur(55px)',
          }}
        />

        {/* Subtle diagonal volumetric light ray (Layer 5) */}
        {(variant === 'hero' || variant === 'holdings' || variant === 'catalog') && (
          <div
            className="absolute -top-60 left-1/4 w-[280px] h-[900px] animate-beam-shift pointer-events-none"
            style={{
              background:
                'linear-gradient(to right, transparent, rgba(195, 166, 107, 0.06), rgba(245, 240, 229, 0.03), transparent)',
              filter: 'blur(30px)',
              transform: 'rotate(-25deg)',
            }}
          />
        )}

        {/* Fine Architectural Stacks Blueprint Grid Lines */}
        <div
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(to right, #C3A66B 1px, transparent 1px), linear-gradient(to bottom, #C3A66B 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Subtle Edge Vignettes */}
        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black/25 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/25 to-transparent pointer-events-none" />
      </div>

      {/* ==============================================================
          LAYER 4: ATMOSPHERIC GOLD DUST PARTICLES
          ============================================================== */}
      {(variant === 'hero' || variant === 'holdings' || variant === 'stats' || variant === 'catalog') && (
        <GoldenDustCanvas className="opacity-60 pointer-events-none z-[1]" />
      )}

      {/* ==============================================================
          LAYER 2 & 3: DISTANT FLOATING BOOKS & DRIFTING PARCHMENT PAGES
          (Placed strategically in the background depending on section)
          ============================================================== */}
      <div className="absolute inset-0 pointer-events-none z-[2] overflow-hidden">
        {/* HERO SECTION BACKGROUND ACCENTS */}
        {variant === 'hero' && (
          <>
            <DistantFloatingBook
              color="burgundy"
              size="md"
              variant={1}
              style={{ top: '15%', left: '4%' }}
            />
            <DistantFloatingBook
              color="gold"
              size="sm"
              variant={2}
              style={{ top: '68%', left: '8%' }}
            />
            <DistantFloatingBook
              color="charcoal"
              size="sm"
              variant={3}
              style={{ top: '22%', right: '5%' }}
            />
            <DriftingParchmentPage
              variant={1}
              style={{ top: '48%', left: '2%' }}
            />
            <DriftingParchmentPage
              variant={2}
              style={{ top: '75%', right: '6%' }}
            />
          </>
        )}

        {/* STATISTICS SECTION BACKGROUND ACCENTS */}
        {variant === 'stats' && (
          <>
            <DistantFloatingBook
              color="terracotta"
              size="sm"
              variant={2}
              style={{ top: '20%', left: '2%' }}
            />
            <DistantFloatingBook
              color="forest"
              size="sm"
              variant={4}
              style={{ top: '25%', right: '2%' }}
            />
            <DriftingParchmentPage
              variant={3}
              style={{ bottom: '15%', left: '10%' }}
            />
            <DriftingParchmentPage
              variant={1}
              style={{ top: '12%', right: '8%' }}
            />
          </>
        )}

        {/* FEATURED HOLDINGS SECTION BACKGROUND ACCENTS */}
        {variant === 'holdings' && (
          <>
            <DistantFloatingBook
              color="gold"
              size="md"
              variant={3}
              style={{ top: '8%', left: '2%' }}
            />
            <DistantFloatingBook
              color="burgundy"
              size="sm"
              variant={1}
              style={{ top: '12%', right: '3%' }}
            />
            <DistantFloatingBook
              color="walnut"
              size="sm"
              variant={4}
              style={{ bottom: '10%', left: '3%' }}
            />
            <DriftingParchmentPage
              variant={2}
              style={{ top: '45%', right: '1.5%' }}
            />
            <DriftingParchmentPage
              variant={1}
              style={{ bottom: '18%', right: '4%' }}
            />
          </>
        )}

        {/* CATALOGUE BACKGROUND ACCENTS */}
        {variant === 'catalog' && (
          <>
            <DistantFloatingBook
              color="forest"
              size="md"
              variant={1}
              style={{ top: '10%', left: '1.5%' }}
            />
            <DistantFloatingBook
              color="terracotta"
              size="sm"
              variant={3}
              style={{ top: '15%', right: '2%' }}
            />
            <DistantFloatingBook
              color="gold"
              size="sm"
              variant={2}
              style={{ bottom: '20%', right: '1.5%' }}
            />
            <DriftingParchmentPage
              variant={1}
              style={{ top: '40%', left: '1%' }}
            />
            <DriftingParchmentPage
              variant={2}
              style={{ bottom: '30%', right: '2%' }}
            />
          </>
        )}

        {/* WORKFLOW PROTOCOL ACCENTS */}
        {variant === 'workflow' && (
          <>
            <DriftingParchmentPage
              variant={3}
              style={{ top: '10%', left: '4%' }}
            />
            <DriftingParchmentPage
              variant={1}
              style={{ bottom: '15%', right: '5%' }}
            />
            <DistantFloatingBook
              color="charcoal"
              size="sm"
              variant={4}
              style={{ top: '18%', right: '3%' }}
            />
          </>
        )}
      </div>

      {/* ==============================================================
          FOREGROUND CONTENT
          ============================================================== */}
      <div className="relative z-10 w-full">
        {children}
      </div>
    </div>
  );
};
