import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { jsPDF } from "https://esm.sh/jspdf@2.5.1";

serve(async () => {
  const key = Deno.env.get("PRINTNODE_API_KEY");
  if (!key) return new Response(JSON.stringify({ error: "no key" }), { status: 500 });

  const pdf = new jsPDF();
  pdf.setFontSize(40);
  pdf.text("PRUEBA CHARLS", 20, 60);
  pdf.text("FLOWERS", 20, 100);
  pdf.setFontSize(16);
  pdf.text("Test PrintNode - " + new Date().toISOString(), 20, 140);

  const ab = pdf.output("arraybuffer");
  const bytes = new Uint8Array(ab);
  let bin = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    bin += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  const pdfB64 = btoa(bin);

  const basic = btoa(`${key}:`);
  const pn = await fetch("https://api.printnode.com/printjobs", {
    method: "POST",
    headers: { Authorization: `Basic ${basic}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      printerId: 75544825,
      title: "PRUEBA CHARLS FLOWERS",
      contentType: "pdf_base64",
      content: pdfB64,
      source: "charls-test-2",
      qty: 1,
    }),
  });
  const pnText = await pn.text();

  return new Response(
    JSON.stringify({
      pdf_bytes: bytes.length,
      printjob_status: pn.status,
      printjob: pnText,
    }),
    { headers: { "Content-Type": "application/json" } },
  );
});