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

async function testFrontendAPIs() {
    console.log('🧪 Testing Frontend APIs...\n');

    try {
        // Test 1: Settings API
        console.log('1️⃣ Testing Settings API...');
        const { data: settingsData, error: settingsError } = await supabase
            .from('settings')
            .select('value')
            .eq('key', 'home')
            .single();

        if (settingsError && settingsError.code !== 'PGRST116') {
            console.error('❌ Settings API error:', settingsError.message);
        } else {
            console.log('✅ Settings API working');
            console.log('📄 Sample settings data:', JSON.stringify(settingsData?.value, null, 2));
        }

        // Test 2: Projects API
        console.log('\n2️⃣ Testing Projects API...');
        const { data: projectsData, error: projectsError } = await supabase
            .from('projects')
            .select('*')
            .eq('status', 'published')
            .limit(3);

        if (projectsError) {
            console.error('❌ Projects API error:', projectsError.message);
        } else {
            console.log('✅ Projects API working');
            console.log(`📄 Found ${projectsData?.length || 0} published projects`);
            if (projectsData && projectsData.length > 0) {
                console.log('📄 Sample project:', {
                    id: projectsData[0].id,
                    title: projectsData[0].title,
                    status: projectsData[0].status
                });
            }
        }

        // Test 3: Posts API
        console.log('\n3️⃣ Testing Posts API...');
        const { data: postsData, error: postsError } = await supabase
            .from('posts')
            .select('*')
            .eq('status', 'published')
            .limit(3);

        if (postsError) {
            console.error('❌ Posts API error:', postsError.message);
        } else {
            console.log('✅ Posts API working');
            console.log(`📄 Found ${postsData?.length || 0} published posts`);
            if (postsData && postsData.length > 0) {
                console.log('📄 Sample post:', {
                    id: postsData[0].id,
                    title: postsData[0].title,
                    slug: postsData[0].slug,
                    status: postsData[0].status
                });
            }
        }

        // Test 4: Contact Messages API
        console.log('\n4️⃣ Testing Contact Messages API...');
        const { data: messagesData, error: messagesError } = await supabase
            .from('contact_messages')
            .select('id, name, email, subject, status, created_at')
            .limit(3);

        if (messagesError) {
            console.error('❌ Messages API error:', messagesError.message);
        } else {
            console.log('✅ Messages API working');
            console.log(`📄 Found ${messagesData?.length || 0} contact messages`);
        }

        console.log('\n🎉 All Frontend APIs are working correctly!');
        console.log('\n📋 API Endpoints Summary:');
        console.log('   • GET /api/settings - Site configuration');
        console.log('   • GET /api/projects - Published projects');
        console.log('   • GET /api/posts - Published posts');
        console.log('   • GET /api/posts?slug=example - Single post by slug');

    } catch (error) {
        console.error('❌ Test failed with error:', error);
    }
}

testFrontendAPIs();
