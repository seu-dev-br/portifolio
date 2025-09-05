import { createClient } from '@supabase/supabase-js';

// Configurações do Supabase
const supabaseUrl = 'https://nattvkjaecceirxthizc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hdHR2a2phZWNjZWlyeHRoaXpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5MjM2NTMsImV4cCI6MjA3MjQ5OTY1M30.K6Nfu5oGeoo6bZyToBNWkBdA1CncXEjWIrSydlMU2WQ';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testAdminSave() {
    console.log('🧪 Testando salvamento do painel administrativo...');

    try {
        // Simular os dados que o painel administrativo enviaria
        const aboutData = {
            bio: 'Olá! Sou Ítalo Antonio, desenvolvedor Full Stack especializado em tecnologias modernas.',
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
                    name: 'AWS Certified Solutions Architect',
                    issuer: 'Amazon Web Services',
                    date: '2024',
                    description: 'Certificação em arquitetura de soluções na AWS',
                    image: 'https://exemplo.com/certificado-aws.jpg'
                }
            ],
            gallery: [
                {
                    title: 'Projeto E-commerce',
                    image: 'https://exemplo.com/projeto1.jpg',
                    description: 'Plataforma de e-commerce completa com React e Node.js'
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

        console.log('💾 Testando salvamento com update...');

        const { data, error } = await supabase
            .from('settings')
            .update({
                value: aboutData,
                updated_at: new Date().toISOString()
            })
            .eq('key', 'about')
            .select();

        if (error) {
            console.error('❌ Erro no salvamento:', error);
            console.log('💡 Código do erro:', error.code);
            console.log('💡 Mensagem:', error.message);
            return;
        }

        console.log('✅ Salvamento realizado com sucesso!');
        console.log('📊 Dados salvos:', data);

        // Verificar se foi salvo corretamente
        const { data: verifyData, error: verifyError } = await supabase
            .from('settings')
            .select('*')
            .eq('key', 'about')
            .single();

        if (verifyError) {
            console.error('❌ Erro ao verificar dados:', verifyError);
            return;
        }

        console.log('✅ Verificação dos dados salvos:');
        console.log('- Bio:', verifyData.value.bio.substring(0, 50) + '...');
        console.log('- Skills Frontend:', verifyData.value.skills.frontend.length);
        console.log('- Experiência:', verifyData.value.experience.length);
        console.log('- Certificações:', verifyData.value.certifications.length);
        console.log('- Galeria:', verifyData.value.gallery.length);

    } catch (error) {
        console.error('❌ Erro geral no teste:', error);
    }
}

// Executar teste
testAdminSave();
