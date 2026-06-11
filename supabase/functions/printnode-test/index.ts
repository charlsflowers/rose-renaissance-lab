import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async () => {
  const key = Deno.env.get("PRINTNODE_API_KEY");
  if (!key) return new Response(JSON.stringify({ error: "no key" }), { status: 500 });
  const basic = btoa(`${key}:`);

  // 1) whoami
  const who = await fetch("https://api.printnode.com/whoami", {
    headers: { Authorization: `Basic ${basic}` },
  });
  const whoText = await who.text();

  // 2) Small PDF (minimal valid PDF "Test")
  const pdfBase64 =
    "JVBERi0xLjQKJcOkw7zDtsOfCjIgMCBvYmoKPDwvTGVuZ3RoIDMgMCBSL0ZpbHRlci9GbGF0ZURlY29kZT4+CnN0cmVhbQp4nCvkMlAwUDC1NNUzMVGwMDHUszRSKErlCtfiyuMK5AIAcRsHbgplbmRzdHJlYW0KZW5kb2JqCjMgMCBvYmoKMzgKZW5kb2JqCjUgMCBvYmoKPDwvVHlwZS9QYWdlL01lZGlhQm94WzAgMCAyMDAgMjAwXS9SZXNvdXJjZXM8PC9Gb250PDwvRjEgNCAwIFI+Pj4+L0NvbnRlbnRzIDIgMCBSL1BhcmVudCA2IDAgUj4+CmVuZG9iago0IDAgb2JqCjw8L1R5cGUvRm9udC9TdWJ0eXBlL1R5cGUxL0Jhc2VGb250L0hlbHZldGljYT4+CmVuZG9iago2IDAgb2JqCjw8L1R5cGUvUGFnZXMvS2lkc1s1IDAgUl0vQ291bnQgMT4+CmVuZG9iagoxIDAgb2JqCjw8L1R5cGUvQ2F0YWxvZy9QYWdlcyA2IDAgUj4+CmVuZG9iago3IDAgb2JqCjw8L1Byb2R1Y2VyKHRlc3QpPj4KZW5kb2JqCnhyZWYKMCA4CjAwMDAwMDAwMDAgNjU1MzUgZgowMDAwMDAwMzc3IDAwMDAwIG4KMDAwMDAwMDAxNSAwMDAwMCBuCjAwMDAwMDAxMzMgMDAwMDAgbgowMDAwMDAwMjc1IDAwMDAwIG4KMDAwMDAwMDE1MiAwMDAwMCBuCjAwMDAwMDAzMjUgMDAwMDAgbgowMDAwMDAwNDIxIDAwMDAwIG4KdHJhaWxlcgo8PC9TaXplIDgvUm9vdCAxIDAgUi9JbmZvIDcgMCBSPj4Kc3RhcnR4cmVmCjQ1NQolJUVPRgo=";

  const pn = await fetch("https://api.printnode.com/printjobs", {
    method: "POST",
    headers: { Authorization: `Basic ${basic}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      printerId: 75544825,
      title: "Charls PrintNode test",
      contentType: "pdf_base64",
      content: pdfBase64,
      source: "charls-test",
      qty: 1,
    }),
  });
  const pnText = await pn.text();

  return new Response(
    JSON.stringify({
      whoami_status: who.status,
      whoami: whoText,
      printjob_status: pn.status,
      printjob: pnText,
    }),
    { headers: { "Content-Type": "application/json" } },
  );
});