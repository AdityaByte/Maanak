import type { Standard } from "@/types/standard";

interface StandardCardProps {
  standard: Standard;
}

export default function StandardCard({ standard, className = "" }: any) {
  return (
    <div
      className={`h-full flex flex-col justify-between bg-card border border-border rounded-2xl p-6 shadow-xs hover:border-border/80 transition-all ${className}`}
    >
      {/* Top Content: Code, Title, Content & Categories */}
      <div className="space-y-3">
        {/* Code ID */}
        <p className="text-xs font-semibold text-primary tracking-wide">
          {standard.id}
        </p>

        {/* Standard Title - line clamped so all titles take equal visual space */}
        <h3
          className="text-base font-bold text-foreground leading-snug line-clamp-2 min-h-[3rem]"
          title={standard.title}
        >
          {standard.title}
        </h3>

        {/* Content / Summary - clamped to 2 lines */}
        <p className="text-xs text-muted-foreground line-clamp-2 min-h-[2rem]">
          {standard.content}
        </p>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {standard.category && (
            <span className="inline-block px-2.5 py-1 text-[11px] font-medium rounded-lg bg-primary/10 text-primary">
              {standard.category}
            </span>
          )}
          {standard.sub_category && (
            <span className="inline-block px-2.5 py-1 text-[11px] font-medium rounded-lg bg-muted text-muted-foreground">
              {standard.sub_category}
            </span>
          )}
        </div>
      </div>

      {/* Bottom Metadata: Pushed to the bottom evenly via mt-auto */}
      <div className="mt-6 pt-4 border-t border-border grid grid-cols-2 gap-y-3 gap-x-4 text-xs">
        <div>
          <span className="block text-[11px] text-muted-foreground">Published</span>
          <span className="font-semibold text-foreground">
            {standard.year_published || "N/A"}
          </span>
        </div>
        <div>
          <span className="block text-[11px] text-muted-foreground">Last Amended</span>
          <span className="font-semibold text-foreground">
            {standard.last_amended || "N/A"}
          </span>
        </div>
        <div>
          <span className="block text-[11px] text-muted-foreground">Certification</span>
          <span className="font-semibold text-foreground truncate block" title={standard.certification_type}>
            {standard.certification_type || "N/A"}
          </span>
        </div>
        <div>
          <span className="block text-[11px] text-muted-foreground">Mandatory</span>
          <span className="font-semibold text-foreground">
            {standard.certificate_mandatory ? "Yes" : "No"}
          </span>
        </div>
      </div>
    </div>
  );
}