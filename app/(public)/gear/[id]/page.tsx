export default async function GearDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Gear Details Page</h1>
      <p>URL: /gear/{id}</p>
      <p>Current Gear ID: <strong>{id}</strong></p>
    </div>
  );
}