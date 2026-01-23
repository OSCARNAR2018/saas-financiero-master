const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read frontend .env.local
const envPath = path.join(__dirname, '../frontend/.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split(/\r?\n/).forEach(line => {
    const parts = line.split('=');
    if (parts.length >= 2) {
        env[parts[0].trim()] = parts.slice(1).join('=').trim();
    }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Faltan variables en .env.local");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
    console.log(`Probando conexión a ${supabaseUrl} con Anon Key...`);

    // 1. Test Select
    const { data: selectData, error: selectError } = await supabase
        .from('configuracion')
        .select('*')
        .limit(1);

    if (selectError) {
        console.error("❌ Error de LECTURA:", selectError.message);
    } else {
        console.log("✅ LECTURA exitosa. Datos:", selectData);

        if (selectData.length > 0) {
            // 2. Test Update
            console.log("Probando ESCRITURA (Update)...");
            const { error: updateError } = await supabase
                .from('configuracion')
                .update({ updated_at: new Date().toISOString() })
                .eq('id', selectData[0].id);

            if (updateError) {
                console.error("❌ Error de ESCRITURA (RLS probablemente):", updateError.message);
            } else {
                console.log("✅ ESCRITURA exitosa.");
            }
        }
    }
}

test();
