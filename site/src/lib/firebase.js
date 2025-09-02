// Firebase configuration for Astro build process
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where, orderBy } from 'firebase/firestore';

// Firebase config - These will be set as environment variables during build
const firebaseConfig = {
    apiKey: import.meta.env.FIREBASE_PUBLIC_API_KEY || process.env.FIREBASE_PUBLIC_API_KEY,
    authDomain: import.meta.env.FIREBASE_PUBLIC_AUTH_DOMAIN || process.env.FIREBASE_PUBLIC_AUTH_DOMAIN,
    projectId: import.meta.env.FIREBASE_PUBLIC_PROJECT_ID || process.env.FIREBASE_PUBLIC_PROJECT_ID,
    storageBucket: import.meta.env.FIREBASE_PUBLIC_STORAGE_BUCKET || process.env.FIREBASE_PUBLIC_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.FIREBASE_PUBLIC_MESSAGING_SENDER_ID || process.env.FIREBASE_PUBLIC_MESSAGING_SENDER_ID,
    appId: import.meta.env.FIREBASE_PUBLIC_APP_ID || process.env.FIREBASE_PUBLIC_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Helper functions for fetching data during build
export async function getAllPublishedPosts() {
    try {
        const postsRef = collection(db, 'posts');
        const q = query(
            postsRef,
            where('status', '==', 'published'),
            orderBy('publishedAt', 'desc')
        );
        
        const querySnapshot = await getDocs(q);
        const posts = [];
        
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            posts.push({
                id: doc.id,
                title: data.title,
                slug: data.slug,
                excerpt: data.excerpt,
                contentMarkdown: data.contentMarkdown,
                coverImage: data.coverImage,
                tags: data.tags || [],
                publishedAt: data.publishedAt,
                createdAt: data.createdAt
            });
        });
        
        return posts;
    } catch (error) {
        console.error('Error fetching published posts:', error);
        return [];
    }
}

export async function getPostBySlug(slug) {
    try {
        const postsRef = collection(db, 'posts');
        const q = query(
            postsRef,
            where('slug', '==', slug),
            where('status', '==', 'published')
        );
        
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
            return null;
        }
        
        const doc = querySnapshot.docs[0];
        const data = doc.data();
        
        return {
            id: doc.id,
            title: data.title,
            slug: data.slug,
            excerpt: data.excerpt,
            contentMarkdown: data.contentMarkdown,
            coverImage: data.coverImage,
            tags: data.tags || [],
            publishedAt: data.publishedAt,
            createdAt: data.createdAt
        };
    } catch (error) {
        console.error('Error fetching post by slug:', error);
        return null;
    }
}

export async function getAllPostSlugs() {
    try {
        const postsRef = collection(db, 'posts');
        const q = query(
            postsRef,
            where('status', '==', 'published')
        );
        
        const querySnapshot = await getDocs(q);
        const slugs = [];
        
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (data.slug) {
                slugs.push(data.slug);
            }
        });
        
        return slugs;
    } catch (error) {
        console.error('Error fetching post slugs:', error);
        return [];
    }
}

// Helper function to format dates
export function formatDate(timestamp) {
    if (!timestamp) return 'Data não disponível';
    
    // Handle Firestore Timestamp
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    
    return date.toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Helper function to get reading time estimate
export function getReadingTime(content) {
    if (!content) return '0 min';
    
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    
    return `${minutes} min`;
}

export { db };
