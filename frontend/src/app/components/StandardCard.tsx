import type { Standard } from "@/types/standard";

interface StandardCardProps {
  standard: Standard;
}

export default function StandardCard({
  standard,
}: StandardCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      
      {/* Standard ID */}
      <p className="mb-3 text-sm font-medium text-primary">
        {standard.id}
      </p>

      {/* Title */}
      <h2 className="mb-3 text-xl font-semibold leading-7 text-foreground">
        {standard.title}
      </h2>

      {/* Content */}
      <p className="mb-4 line-clamp-3 text-sm leading-6 text-muted-foreground">
        {standard.content}
      </p>

      {/* Categories */}
      <div className="mb-5 flex flex-wrap gap-2">
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          {standard.category}
        </span>

        {standard.sub_category && (
          <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
            {standard.sub_category}
          </span>
        )}
      </div>

      {/* Divider */}
      <div className="mb-5 border-t border-border" />

      {/* Metadata */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-5">
        
        {/* Published */}
        <div>
          <p className="text-xs font-medium text-muted-foreground">
            Published
          </p>

          <p className="mt-1 text-sm font-medium text-foreground">
            {standard.year_published ?? "N/A"}
          </p>
        </div>

        {/* Last Amended */}
        <div>
          <p className="text-xs font-medium text-muted-foreground">
            Last Amended
          </p>

          <p className="mt-1 text-sm font-medium text-foreground">
            {standard.last_amended ?? "N/A"}
          </p>
        </div>

        {/* Certification */}
        <div>
          <p className="text-xs font-medium text-muted-foreground">
            Certification
          </p>

          <p className="mt-1 text-sm font-medium text-foreground">
            {standard.certification_type ?? "N/A"}
          </p>
        </div>

        {/* Mandatory */}
        <div>
          <p className="text-xs font-medium text-muted-foreground">
            Mandatory
          </p>

          <p className="mt-1 text-sm font-medium text-foreground">
            {standard.certificate_mandatory === null
              ? "N/A"
              : standard.certificate_mandatory
              ? "Yes"
              : "No"}
          </p>
        </div>
      </div>
    </div>
  );
}