// src/pages/api/settings.ts
import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.SUPABASE_URL;
const supabaseKey = import.meta.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export const GET: APIRoute = async () => {
    try {
        console.log('📡 API Settings: Recebendo requisição para configurações...');

        // Buscar configurações da página inicial
        const { data: homeSettings, error: homeError } = await supabase
            .from('settings')
            .select('value')
            .eq('key', 'home')
            .single();

        if (homeError && homeError.code !== 'PGRST116') {
            console.error('❌ Erro ao buscar configurações da home:', homeError);
        }

        // Buscar configurações da página sobre
        const { data: aboutSettings, error: aboutError } = await supabase
            .from('settings')
            .select('value')
            .eq('key', 'about')
            .single();

        if (aboutError && aboutError.code !== 'PGRST116') {
            console.error('❌ Erro ao buscar configurações da about:', aboutError);
        }

        // Preparar resposta com valores padrão se não houver dados
        const response = {
            success: true,
            data: {
                home: homeSettings?.value || getDefaultHomeSettings(),
                about: aboutSettings?.value || getDefaultAboutSettings()
            },
            timestamp: new Date().toISOString()
        };

        console.log('✅ API Settings: Configurações retornadas com sucesso');

        return new Response(JSON.stringify(response), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'public, max-age=300', // Cache por 5 minutos
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET',
                'Access-Control-Allow-Headers': 'Content-Type'
            }
        });

    } catch (error) {
        console.error('❌ API Settings: Erro interno:', error);

        return new Response(JSON.stringify({
            success: false,
            error: 'Erro interno do servidor',
            timestamp: new Date().toISOString()
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }
};

// Valores padrão para quando não há configurações salvas
function getDefaultHomeSettings() {
    return {
        hero: {
            title: 'Olá, eu sou Ítalo Antonio',
            subtitle: 'Desenvolvedor Full Stack',
            description: 'Criando experiências digitais excepcionais com paixão por tecnologia e inovação.',
            ctaPrimary: 'Ver Projetos',
            ctaSecondary: 'Entrar em Contato'
        },
        slider: {
            enabled: true,
            autoplay: true,
            delay: 5000
        },
        featured: {
            title: 'Projetos em Destaque',
            description: 'Alguns dos meus trabalhos mais recentes...',
            count: 3
        },
        posts: {
            title: 'Últimas Publicações',
            description: 'Confira minhas últimas publicações...',
            count: 3
        }
    };
}

function getDefaultAboutSettings() {
    return {
        bio: 'Desenvolvedor Full Stack apaixonado por criar soluções tecnológicas inovadoras.',
        profileImage: '',
        skills: {
            frontend: 'HTML5, CSS3, JavaScript, TypeScript, React, Vue.js',
            backend: 'Node.js, Python, PHP',
            database: 'PostgreSQL, MySQL, MongoDB',
            tools: 'Git, Docker, AWS, Linux'
        },
        social: {
            github: '',
            linkedin: '',
            twitter: '',
            instagram: ''
        }
    };
}
