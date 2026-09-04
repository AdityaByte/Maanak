export interface Standard {
  id: string;
  title: string;
  content: string;
  category: string;
  sub_category: string | null;
  year_published: number | null;
  last_amended: number | null;
  certification_type: string | null;
  certificate_mandatory: boolean | null;
}