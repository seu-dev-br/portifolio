// Test script to verify admin panel event listeners
console.log('Testing admin panel event listeners...');

// Check if elements exist
const homeBtn = document.getElementById('home-manager-btn');
const aboutBtn = document.getElementById('about-manager-btn');
const homeSection = document.getElementById('home-manager-section');
const aboutSection = document.getElementById('about-manager-section');

console.log('Home manager button:', homeBtn ? 'Found' : 'Not found');
console.log('About manager button:', aboutBtn ? 'Found' : 'Not found');
console.log('Home manager section:', homeSection ? 'Found' : 'Not found');
console.log('About manager section:', aboutSection ? 'Found' : 'Not found');

// Test click events
if (homeBtn) {
    homeBtn.click();
    console.log('Home button clicked successfully');
    setTimeout(() => {
        console.log('Home section display:', homeSection.style.display);
        console.log('About section display:', aboutSection.style.display);
    }, 100);
}

if (aboutBtn) {
    setTimeout(() => {
        aboutBtn.click();
        console.log('About button clicked successfully');
        setTimeout(() => {
            console.log('Home section display:', homeSection.style.display);
            console.log('About section display:', aboutSection.style.display);
        }, 100);
    }, 200);
}
