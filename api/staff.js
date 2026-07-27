export default async function handler(req, res) {
  const SUPABASE_URL = 'https://ofgicptdoygttkyndrnb.supabase.co';
  const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9mZ2ljcHRkb3lndHRreW5kcm5iIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDczNTkyOCwiZXhwIjoyMTAwMzExOTI4fQ.0SUbw0Cx_lu4fV-9JAvWk7gKKtt1lGfaISwHopcAri4';

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/staff_mentions?select=*`, {
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const error = await response.text();
      return res.status(response.status).json({ error });
    }

    const data = await response.json();
    res.setHeader('Cache-Control', 'max-age=60');
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
