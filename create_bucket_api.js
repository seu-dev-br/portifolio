import { createClient } from '@supabase/supabase-js';

// Configurações do Supabase
const supabaseUrl = 'https://nattvkjaecceirxthizc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hdHR2a2phZWNjZWlyeHRoaXpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5MjM2NTMsImV4cCI6MjA3MjQ5OTY1M30.K6Nfu5oGeoo6bZyToBNWkBdA1CncXEjWIrSydlMU2WQ';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createImagesBucket() {
    console.log('🏗️ Criando bucket de imagens...');

    try {
        // Tentar criar o bucket
        const { data, error } = await supabase.storage.createBucket('images', {
            public: true,
            allowedMimeTypes: ['image/png', 'image/jpg', 'image/jpeg', 'image/webp', 'image/gif'],
            fileSizeLimit: 5242880 // 5MB
        });

        if (error) {
            console.error('❌ Erro ao criar bucket:', error);
            console.log('💡 Você pode precisar executar o script SQL no painel do Supabase');
            return;
        }

        console.log('✅ Bucket criado com sucesso:', data);

        // Verificar se foi criado
        const { data: buckets, error: listError } = await supabase.storage.listBuckets();

        if (listError) {
            console.error('❌ Erro ao verificar buckets:', listError);
            return;
        }

        const imagesBucket = buckets.find(bucket => bucket.name === 'images');
        if (imagesBucket) {
            console.log('✅ Bucket "images" confirmado:', imagesBucket);
        } else {
            console.log('⚠️ Bucket pode ter sido criado mas não está visível ainda');
        }

    } catch (error) {
        console.error('❌ Erro geral:', error);
        console.log('💡 Alternativa: Execute o script SQL create_images_bucket.sql no painel do Supabase');
    }
}

// Executar criação do bucket
createImagesBucket();
