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

async function testSupabaseConnection() {
    console.log('🧪 Testing Supabase connection and settings operations...\n');

    try {
        // Test 1: Basic connection
        console.log('1️⃣ Testing basic connection...');
        const { data: connectionTest, error: connectionError } = await supabase
            .from('settings')
            .select('count')
            .limit(1);

        if (connectionError) {
            console.error('❌ Connection failed:', connectionError.message);
            return;
        }
        console.log('✅ Connection successful\n');

        // Test 2: Insert test settings
        console.log('2️⃣ Testing settings insertion...');
        const testHomeData = {
            hero: {
                title: 'Test Hero Title',
                subtitle: 'Test Subtitle',
                description: 'Test description for hero section'
            },
            slider: {
                enabled: true,
                autoplay: true,
                delay: 3000
            },
            featured: {
                title: 'Featured Projects',
                description: 'My latest work',
                count: 6
            },
            posts: {
                title: 'Latest Posts',
                description: 'Thoughts and insights',
                count: 3
            }
        };

        const { data: insertData, error: insertError } = await supabase
            .from('settings')
            .upsert({
                key: 'home',
                value: testHomeData,
                updated_at: new Date().toISOString()
            }, {
                onConflict: 'key'
            });

        if (insertError) {
            console.error('❌ Insert failed:', insertError.message);
            return;
        }
        console.log('✅ Home settings inserted successfully\n');

        // Test 3: Retrieve settings
        console.log('3️⃣ Testing settings retrieval...');
        const { data: retrievedData, error: retrieveError } = await supabase
            .from('settings')
            .select('value')
            .eq('key', 'home')
            .single();

        if (retrieveError) {
            console.error('❌ Retrieve failed:', retrieveError.message);
            return;
        }

        console.log('✅ Settings retrieved successfully');
        console.log('📄 Retrieved data:', JSON.stringify(retrievedData.value, null, 2));
        console.log('\n🎉 All tests passed! Supabase integration is working correctly.');

    } catch (error) {
        console.error('❌ Test failed with error:', error);
    }
}

testSupabaseConnection();
