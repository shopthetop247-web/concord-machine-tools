export default async function ModelPage({ params }: any) {
  console.log("ROUTE PARAMS:", params);

  return (
    <div style={{ padding: 24 }}>
      <h1>ROUTE WORKS</h1>
      <pre>{JSON.stringify(params, null, 2)}</pre>
    </div>
  );
}
