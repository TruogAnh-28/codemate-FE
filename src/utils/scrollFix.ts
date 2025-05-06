// Create a new file: src/utils/scrollFix.ts
export function applyScrollFix() {
  // Check if the document element exists (client-side only)
  if (typeof document !== 'undefined') {
    // Function to ensure scrollbar visibility
    const ensureScrollbar = () => {
      // Force recalculation of layout with scrollbar
      document.documentElement.style.overflow = 'auto';
      document.body.style.overflow = 'auto';
      
      // For Vuetify specifically
      const appElement = document.querySelector('.v-application');
      if (appElement instanceof HTMLElement) {
        appElement.style.overflow = 'auto';
        appElement.style.height = '100%';
      }
      
      // Force layout recalculation
      window.dispatchEvent(new Event('resize'));
    };
    
    // Apply immediately
    ensureScrollbar();
    
    // Also apply after route changes
    // This is important since Vue router transitions can cause the issue
    window.addEventListener('load', ensureScrollbar);
    window.addEventListener('popstate', ensureScrollbar);
    
    // Apply on resize as well for good measure
    window.addEventListener('resize', ensureScrollbar);
    
    // Create a mutation observer to watch for DOM changes
    // This helps when content is loaded dynamically
    const observer = new MutationObserver(ensureScrollbar);
    observer.observe(document.body, { 
      childList: true, 
      subtree: true 
    });
  }
}