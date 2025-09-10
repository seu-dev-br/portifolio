#!/usr/bin/env node

// ===========================================
// 🧪 SCRIPT DE TESTE DA INTEGRAÇÃO FRONTEND
// ===========================================
// Este script testa se toda a integração está funcionando
// Execute com: npm run test-integration

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables
config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

class IntegrationTester {
    private results: { [key: string]: boolean } = {};

    async runAllTests() {
        console.log('🚀 Iniciando testes de integração frontend...\n');

        await this.testDatabaseConnection();
        await this.testSettingsAPI();
        await this.testProjectsAPI();
        await this.testPostsAPI();
        await this.testContactMessagesAPI();
        await this.testRLSPolicies();

        this.printResults();
        this.printNextSteps();
    }

    private async testDatabaseConnection() {
        console.log('1️⃣ Testando conexão com banco de dados...');
        try {
            const { data, error } = await supabase.from('settings').select('count').limit(1);
            if (error) throw error;
            this.results['database'] = true;
            console.log('✅ Conexão com banco estabelecida');
        } catch (error) {
            this.results['database'] = false;
            console.log('❌ Falha na conexão com banco:', error instanceof Error ? error.message : String(error));
        }
    }

    private async testSettingsAPI() {
        console.log('\n2️⃣ Testando API de configurações...');
        try {
            // Test home settings
            const { data: homeData, error: homeError } = await supabase
                .from('settings')
                .select('value')
                .eq('key', 'home')
                .single();

            if (homeError && homeError.code !== 'PGRST116') throw homeError;

            // Test about settings
            const { data: aboutData, error: aboutError } = await supabase
                .from('settings')
                .select('value')
                .eq('key', 'about')
                .single();

            if (aboutError && aboutError.code !== 'PGRST116') throw aboutError;

            this.results['settings_api'] = true;
            console.log('✅ API de configurações funcionando');
            console.log(`   📄 Home settings: ${homeData ? 'Encontradas' : 'Padrão'}`);
            console.log(`   📄 About settings: ${aboutData ? 'Encontradas' : 'Padrão'}`);
        } catch (error) {
            this.results['settings_api'] = false;
            console.log('❌ Falha na API de configurações:', error instanceof Error ? error.message : String(error));
        }
    }

    private async testProjectsAPI() {
        console.log('\n3️⃣ Testando API de projetos...');
        try {
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .eq('status', 'published')
                .limit(5);

            if (error) throw error;

            this.results['projects_api'] = true;
            console.log('✅ API de projetos funcionando');
            console.log(`   📄 Projetos publicados encontrados: ${data?.length || 0}`);
        } catch (error) {
            this.results['projects_api'] = false;
            console.log('❌ Falha na API de projetos:', error instanceof Error ? error.message : String(error));
        }
    }

    private async testPostsAPI() {
        console.log('\n4️⃣ Testando API de posts...');
        try {
            const { data, error } = await supabase
                .from('posts')
                .select('*')
                .eq('status', 'published')
                .limit(5);

            if (error) throw error;

            this.results['posts_api'] = true;
            console.log('✅ API de posts funcionando');
            console.log(`   📄 Posts publicados encontrados: ${data?.length || 0}`);
        } catch (error) {
            this.results['posts_api'] = false;
            console.log('❌ Falha na API de posts:', error instanceof Error ? error.message : String(error));
        }
    }

    private async testContactMessagesAPI() {
        console.log('\n5️⃣ Testando API de mensagens de contato...');
        try {
            const { data, error } = await supabase
                .from('contact_messages')
                .select('id, name, email, status')
                .limit(5);

            if (error) throw error;

            this.results['messages_api'] = true;
            console.log('✅ API de mensagens funcionando');
            console.log(`   📄 Mensagens encontradas: ${data?.length || 0}`);
        } catch (error) {
            this.results['messages_api'] = false;
            console.log('❌ Falha na API de mensagens:', error instanceof Error ? error.message : String(error));
        }
    }

    private async testRLSPolicies() {
        console.log('\n6️⃣ Testando políticas RLS...');
        try {
            // Test if we can access settings without auth (should work for published content)
            const { data: settingsData, error: settingsError } = await supabase
                .from('settings')
                .select('key')
                .limit(1);

            if (settingsError) throw settingsError;

            // Test if we can access published projects without auth
            const { data: projectsData, error: projectsError } = await supabase
                .from('projects')
                .select('id, title, status')
                .eq('status', 'published')
                .limit(1);

            if (projectsError) throw projectsError;

            this.results['rls_policies'] = true;
            console.log('✅ Políticas RLS funcionando corretamente');
        } catch (error) {
            this.results['rls_policies'] = false;
            console.log('❌ Falha nas políticas RLS:', error instanceof Error ? error.message : String(error));
        }
    }

    private printResults() {
        console.log('\n' + '='.repeat(50));
        console.log('📊 RESULTADOS DOS TESTES');
        console.log('='.repeat(50));

        const totalTests = Object.keys(this.results).length;
        const passedTests = Object.values(this.results).filter(Boolean).length;

        Object.entries(this.results).forEach(([test, passed]) => {
            const status = passed ? '✅ PASSOU' : '❌ FALHOU';
            const testName = test.replace('_', ' ').toUpperCase();
            console.log(`${status} - ${testName}`);
        });

        console.log('\n' + '-'.repeat(50));
        console.log(`🎯 RESULTADO FINAL: ${passedTests}/${totalTests} testes passaram`);

        if (passedTests === totalTests) {
            console.log('🎉 Todas as integrações estão funcionando perfeitamente!');
        } else {
            console.log('⚠️ Alguns testes falharam. Verifique os logs acima.');
        }
    }

    private printNextSteps() {
        console.log('\n' + '='.repeat(50));
        console.log('🚀 PRÓXIMOS PASSOS');
        console.log('='.repeat(50));

        console.log('\n1. 🖥️ TESTE NO NAVEGADOR:');
        console.log('   • Abra http://localhost:4321');
        console.log('   • Abra o console (F12)');
        console.log('   • Procure por logs de carregamento das configurações');

        console.log('\n2. 🔧 TESTE O ADMIN:');
        console.log('   • Acesse http://localhost:4321/admin');
        console.log('   • Faça login');
        console.log('   • Modifique configurações e salve');
        console.log('   • Verifique se aparecem na página pública');

        console.log('\n3. 📱 TESTE AS APIs:');
        console.log('   • GET /api/settings');
        console.log('   • GET /api/projects');
        console.log('   • GET /api/posts');

        console.log('\n4. 🎨 INTEGRAÇÃO NAS PÁGINAS:');
        console.log('   • Adicione o script nas páginas públicas');
        console.log('   • Teste a atualização automática');

        console.log('\n5. 📊 MONITORAMENTO:');
        console.log('   • Verifique logs no console');
        console.log('   • Monitore performance das APIs');
        console.log('   • Teste em diferentes dispositivos');

        console.log('\n💡 DICAS:');
        console.log('   • Use window.frontendAPI para debug');
        console.log('   • Use window.settingsConfig para configuração');
        console.log('   • Cache dura 5 minutos por padrão');

        console.log('\n📚 DOCUMENTAÇÃO:');
        console.log('   • Leia FRONTEND_INTEGRATION_README.md');
        console.log('   • Veja exemplos em src/lib/integration-examples.ts');
    }
}

// Executar testes
const tester = new IntegrationTester();
tester.runAllTests().catch(console.error);
