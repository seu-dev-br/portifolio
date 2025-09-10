// Test script to verify settings loading
console.log('🧪 Testing settings loading...');

// Test loadHomeSettings function
async function testLoadHomeSettings() {
    console.log('📥 Testing loadHomeSettings...');
    try {
        if (typeof loadHomeSettings === 'function') {
            await loadHomeSettings();
            console.log('✅ loadHomeSettings function exists and executed');

            // Check if form fields are populated
            const heroTitle = document.getElementById('hero-title');
            if (heroTitle && heroTitle.value) {
                console.log('✅ Home settings loaded successfully:', heroTitle.value);
            } else {
                console.log('ℹ️  Home settings not found in database (this is normal for first use)');
            }
        } else {
            console.error('❌ loadHomeSettings function not found');
        }
    } catch (error) {
        console.error('❌ Error testing loadHomeSettings:', error);
    }
}

// Test loadAboutSettings function
async function testLoadAboutSettings() {
    console.log('📥 Testing loadAboutSettings...');
    try {
        if (typeof loadAboutSettings === 'function') {
            await loadAboutSettings();
            console.log('✅ loadAboutSettings function exists and executed');

            // Check if form fields are populated
            const aboutBio = document.getElementById('about-bio');
            if (aboutBio && aboutBio.value) {
                console.log('✅ About settings loaded successfully:', aboutBio.value.substring(0, 50) + '...');
            } else {
                console.log('ℹ️  About settings not found in database (this is normal for first use)');
            }
        } else {
            console.error('❌ loadAboutSettings function not found');
        }
    } catch (error) {
        console.error('❌ Error testing loadAboutSettings:', error);
    }
}

// Test save functions
async function testSaveFunctions() {
    console.log('💾 Testing save functions...');

    if (typeof saveHomeSettings === 'function') {
        console.log('✅ saveHomeSettings function exists');
    } else {
        console.error('❌ saveHomeSettings function not found');
    }

    if (typeof saveAboutSettings === 'function') {
        console.log('✅ saveAboutSettings function exists');
    } else {
        console.error('❌ saveAboutSettings function not found');
    }
}

// Run tests after a short delay to ensure DOM is ready
setTimeout(async () => {
    await testLoadHomeSettings();
    await testLoadAboutSettings();
    testSaveFunctions();
    console.log('🎉 Settings test completed!');
}, 2000);
