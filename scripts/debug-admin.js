// Debug script for admin panel project modal
// Run this in the browser console on the admin page

console.log('🔍 Debug: Checking admin panel...');

// Check if adminPanel exists
if (typeof window.adminPanel === 'undefined') {
    console.error('❌ adminPanel is undefined');
} else {
    console.log('✅ adminPanel exists:', window.adminPanel);

    // Check if methods exist
    const methods = ['showProjectModal', 'closeProjectModal', 'saveProject'];
    methods.forEach(method => {
        if (typeof window.adminPanel[method] === 'function') {
            console.log(`✅ ${method} method exists`);
        } else {
            console.error(`❌ ${method} method is missing`);
        }
    });

    // Test calling the methods
    console.log('🧪 Testing showProjectModal...');
    try {
        window.adminPanel.showProjectModal();
        console.log('✅ showProjectModal executed successfully');
    } catch (error) {
        console.error('❌ Error calling showProjectModal:', error);
    }
}

// Check if modal elements exist
const modalElements = [
    'project-modal',
    'project-form',
    'project-title',
    'project-description',
    'project-status'
];

modalElements.forEach(id => {
    const element = document.getElementById(id);
    if (element) {
        console.log(`✅ Element ${id} exists:`, element);
    } else {
        console.error(`❌ Element ${id} not found`);
    }
});

// Check form field editability
setTimeout(() => {
    const titleInput = document.getElementById('project-title');
    if (titleInput) {
        console.log('📝 Testing input editability...');
        const originalValue = titleInput.value;
        titleInput.value = 'Test value';
        if (titleInput.value === 'Test value') {
            console.log('✅ Input is editable');
            titleInput.value = originalValue; // Restore original value
        } else {
            console.error('❌ Input is not editable');
        }
    }
}, 1000);

console.log('🔍 Debug complete. Check the logs above for issues.');
// Arquivo removido (script de debug)
