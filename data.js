// Cloudflare Pages Function
// Endpoint: /api/data
// GET  -> ambil data tersimpan dari KV (untuk semua pengunjung)
// POST -> simpan data baru ke KV (hanya dipanggil dari admin panel, dilindungi password)
//
// SETUP YANG DIBUTUHKAN DI CLOUDFLARE DASHBOARD:
// 1. Buat KV Namespace baru, nama: BIRTHDAY_KV
// 2. Di Pages project > Settings > Functions > KV namespace bindings
//    tambahkan binding: Variable name = BIRTHDAY_KV, KV namespace = BIRTHDAY_KV
// 3. (Opsional) Tambahkan Environment Variable ADMIN_SECRET untuk validasi server-side

const DATA_KEY = "birthday_love_data_v1";

// CORS headers agar bisa diakses dari mana saja (aman karena ini bukan data sensitif)
function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

export async function onRequestOptions() {
  return new Response(null, { headers: corsHeaders() });
}

export async function onRequestGet({ env }) {
  try {
    if (!env.BIRTHDAY_KV) {
      return new Response(
        JSON.stringify({ error: "KV namespace belum di-bind. Lihat komentar di data.js" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders() } }
      );
    }

    const raw = await env.BIRTHDAY_KV.get(DATA_KEY);

    if (!raw) {
      // Belum ada data tersimpan -> kembalikan null, frontend akan pakai default
      return new Response(JSON.stringify({ data: null }), {
        headers: { "Content-Type": "application/json", ...corsHeaders() },
      });
    }

    return new Response(JSON.stringify({ data: JSON.parse(raw) }), {
      headers: { "Content-Type": "application/json", ...corsHeaders() },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders() },
    });
  }
}

export async function onRequestPost({ request, env }) {
  try {
    if (!env.BIRTHDAY_KV) {
      return new Response(
        JSON.stringify({ error: "KV namespace belum di-bind. Lihat komentar di data.js" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders() } }
      );
    }

    const body = await request.json();

    if (!body || typeof body !== "object" || !body.payload) {
      return new Response(JSON.stringify({ error: "Payload tidak valid" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders() },
      });
    }

    // Validasi password di server (pertahanan tambahan selain di frontend)
    // Jika env.ADMIN_SECRET diset di Cloudflare dashboard, password HARUS cocok
    if (env.ADMIN_SECRET) {
      if (body.password !== env.ADMIN_SECRET) {
        return new Response(JSON.stringify({ error: "Password salah" }), {
          status: 401,
          headers: { "Content-Type": "application/json", ...corsHeaders() },
        });
      }
    }

    // Batasi ukuran payload (maks ~2MB, KV limit value 25MB tapi kita jaga2)
    const payloadStr = JSON.stringify(body.payload);
    if (payloadStr.length > 2 * 1024 * 1024) {
      return new Response(JSON.stringify({ error: "Data terlalu besar (maks 2MB). Kurangi jumlah/ukuran foto." }), {
        status: 413,
        headers: { "Content-Type": "application/json", ...corsHeaders() },
      });
    }

    await env.BIRTHDAY_KV.put(DATA_KEY, payloadStr);

    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json", ...corsHeaders() },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders() },
    });
  }
}
