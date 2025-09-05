import { createClient } from '@supabase/supabase-js';

// Configurações do Supabase
const supabaseUrl = 'https://nattvkjaecceirxthizc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hdHR2a2phZWNjZWlyeHRoaXpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5MjM2NTMsImV4cCI6MjA3MjQ5OTY1M30.K6Nfu5oGeoo6bZyToBNWkBdA1CncXEjWIrSydlMU2WQ';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testAboutPageSave() {
    console.log('🧪 Testando salvamento da página Sobre...');

    try {
        // Dados de teste para a página sobre
        const aboutData = {
            bio: 'Olá! Sou Ítalo Antonio, desenvolvedor Full Stack apaixonado por tecnologia.',
            profileImage: 'https://exemplo.com/foto-perfil.jpg',
            skills: {
                frontend: ['HTML5', 'CSS3', 'JavaScript', 'React', 'Vue.js', 'TypeScript', 'Astro'],
                backend: ['Node.js', 'Python', 'PHP', 'Express.js', 'FastAPI', 'Laravel'],
                database: ['MySQL', 'PostgreSQL', 'MongoDB', 'Firebase', 'Redis'],
                tools: ['Git', 'Docker', 'AWS', 'Vercel', 'Figma', 'VS Code']
            },
            experience: [
                {
                    year: '2024',
                    title: 'Desenvolvedor Full Stack',
                    company: 'Empresa Atual',
                    description: 'Desenvolvimento de aplicações web modernas e escaláveis.'
                }
            ],
            education: [
                {
                    institution: 'Universidade',
                    course: 'Ciência da Computação',
                    period: '2020 - 2024'
                }
            ],
            certifications: [
                {
                    name: 'Certificação AWS',
                    issuer: 'Amazon Web Services',
                    date: '2024',
                    description: 'Certificação em serviços da AWS',
                    image: 'https://exemplo.com/certificado-aws.jpg'
                }
            ],
            gallery: [
                {
                    title: 'Projeto Web Moderno',
                    image: 'https://exemplo.com/projeto1.jpg',
                    description: 'Aplicação web desenvolvida com React e Node.js'
                },
                {
                    title: 'Sistema de Gestão',
                    image: 'https://exemplo.com/projeto2.jpg',
                    description: 'Sistema completo para gestão empresarial'
                }
            ],
            socialLinks: {
                github: 'https://github.com/italoantonio',
                linkedin: 'https://linkedin.com/in/italoantonio',
                twitter: '',
                email: 'italo.antonio@exemplo.com'
            },
            updatedAt: new Date().toISOString()
        };

        console.log('💾 Salvando dados da página Sobre...');

        // Primeiro, verificar se já existe um registro
        const { data: existingData } = await supabase
            .from('settings')
            .select('id')
            .eq('key', 'about')
            .single();

        let result;
        if (existingData) {
            // Se existe, fazer update
            console.log('📝 Atualizando registro existente...');
            result = await supabase
                .from('settings')
                .update({
                    value: aboutData,
                    updated_at: new Date().toISOString()
                })
                .eq('key', 'about');
        } else {
            // Se não existe, fazer insert
            console.log('🆕 Criando novo registro...');
            result = await supabase
                .from('settings')
                .insert({
                    key: 'about',
                    value: aboutData,
                    updated_at: new Date().toISOString()
                });
        }

        const { data, error } = result;

        if (error) {
            console.error('❌ Erro ao salvar dados da página Sobre:', error);
            return;
        }

        console.log('✅ Dados da página Sobre salvos com sucesso!');

        // Verificar se os dados foram salvos corretamente
        const { data: savedData, error: fetchError } = await supabase
            .from('settings')
            .select('*')
            .eq('key', 'about')
            .single();

        if (fetchError) {
            console.error('❌ Erro ao recuperar dados salvos:', fetchError);
            return;
        }

        console.log('✅ Dados recuperados com sucesso:');
        console.log('- Bio:', savedData.value.bio);
        console.log('- Skills Frontend:', savedData.value.skills.frontend.length, 'tecnologias');
        console.log('- Experiência:', savedData.value.experience.length, 'itens');
        console.log('- Certificações:', savedData.value.certifications.length, 'itens');
        console.log('- Galeria:', savedData.value.gallery.length, 'imagens');
        console.log('- Links Sociais:', Object.keys(savedData.value.socialLinks).length, 'links');

        console.log('🎉 Teste da página Sobre concluído com sucesso!');

    } catch (error) {
        console.error('❌ Erro geral no teste:', error);
    }
}

// Executar teste
testAboutPageSave();
