import { createClient } from '@supabase/supabase-js';

// Configurações do Supabase
const supabaseUrl = 'https://nattvkjaecceirxthizc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hdHR2a2phZWNjZWlyeHRoaXpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5MjM2NTMsImV4cCI6MjA3MjQ5OTY1M30.K6Nfu5oGeoo6bZyToBNWkBdA1CncXEjWIrSydlMU2WQ';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function finalTest() {
    console.log('🎯 Teste final do sistema de upload de imagens...');

    try {
        // 1. Verificar bucket
        console.log('📦 Verificando bucket images...');
        const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();

        if (bucketsError) {
            console.error('❌ Erro ao listar buckets:', bucketsError);
            console.log('💡 Execute o script SQL create_images_bucket.sql no Supabase');
            return;
        }

        const imagesBucket = buckets.find(bucket => bucket.name === 'images');
        if (!imagesBucket) {
            console.error('❌ Bucket "images" não encontrado!');
            console.log('💡 Execute o script SQL create_images_bucket.sql no Supabase');
            return;
        }

        console.log('✅ Bucket "images" encontrado e acessível');

        // 2. Testar upload de arquivo simples
        console.log('⬆️ Testando upload de arquivo de teste...');
        const testContent = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64');
        const testFile = new File([testContent], 'test.png', { type: 'image/png' });

        const fileName = `test-${Date.now()}.png`;
        const filePath = `about/${fileName}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('images')
            .upload(filePath, testFile);

        if (uploadError) {
            console.error('❌ Erro no upload:', uploadError);
            console.log('💡 Possíveis soluções:');
            console.log('   - Verificar se o usuário está autenticado');
            console.log('   - Verificar políticas RLS do bucket');
            console.log('   - Verificar permissões do Storage');
            return;
        }

        console.log('✅ Upload realizado com sucesso');

        // 3. Obter URL pública
        const { data: { publicUrl } } = supabase.storage
            .from('images')
            .getPublicUrl(filePath);

        console.log('✅ URL pública gerada:', publicUrl);

        // 4. Testar acesso à imagem
        try {
            const response = await fetch(publicUrl);
            if (response.ok) {
                console.log('✅ Imagem acessível publicamente');
            } else {
                console.log('⚠️ Imagem pode ter restrições de acesso');
            }
        } catch (fetchError) {
            console.log('⚠️ Não foi possível testar acesso público');
        }

        console.log('🎉 Sistema de upload de imagens funcionando!');
        console.log('📋 Próximos passos:');
        console.log('   1. Execute o script SQL create_images_bucket.sql no Supabase');
        console.log('   2. Teste o upload no painel administrativo');
        console.log('   3. Verifique se a imagem aparece na página sobre');

    } catch (error) {
        console.error('❌ Erro geral no teste:', error);
    }
}

// Executar teste
finalTest();
