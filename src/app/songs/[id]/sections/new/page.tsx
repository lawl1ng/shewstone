import { SectionForm } from "@/components/SectionForm";

export default async function NewSectionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Add section</h1>
      <SectionForm songId={id} />
    </div>
  );
}
