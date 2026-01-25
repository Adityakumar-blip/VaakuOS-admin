import { ComponentType, lazy, LazyExoticComponent } from 'react';

export interface AppRoute {
  path: string;
  component: LazyExoticComponent<ComponentType<unknown>>;
}

// Use relative path to ensure it works across environments
const pages = import.meta.glob('../pages/**/*.tsx');

/**
 * Normalizes a file path to a route path
 * @param filePath The relative file path from glob (e.g., ../pages/brand/dashboard.tsx)
 * @param section The base section (e.g., brand)
 */
const normalizeRoutePath = (filePath: string, section: string): string => {
  // Normalize windows slashes just in case, though Vite usually handles this
  const normalizedPath = filePath.replace(/\\/g, '/');
  
  // Search for the section segment in the path
  // Expecting: ../pages/brand/dashboard.tsx OR /src/pages/brand/dashboard.tsx
  // We want to extract what comes AFTER /pages/{section}/
  
  const sectionMarker = `/pages/${section}/`;
  const index = normalizedPath.indexOf(sectionMarker);
  
  if (index === -1) return '';
  
  // Extract relative path after section
  // e.g. dashboard.tsx
  let relativePath = normalizedPath.substring(index + sectionMarker.length);
  
  // Remove extension
  relativePath = relativePath.replace(/\.tsx$/, '');

  // Handle index files
  if (relativePath === 'index') {
    return ''; // Root of the section
  }
  if (relativePath.endsWith('/index')) {
    relativePath = relativePath.substring(0, relativePath.lastIndexOf('/index'));
  }

  // Handle dynamic segments [id] -> :id
  relativePath = relativePath.replace(/\[([^\]]+)\]/g, ':$1');

  return relativePath;
};

/**
 * Scans for routes belonging to a specific admin section (brand, agency, owner)
 * @param section The directory name under src/pages to scan (e.g., 'brand')
 */
export const getRoutesForSection = (section: string): AppRoute[] => {
  const routes: AppRoute[] = [];
  const sectionLower = section.toLowerCase();

  for (const path in pages) {
    const pathLower = path.toLowerCase();
    // Check if path contains the section folder
    if (pathLower.includes(`/pages/${sectionLower}/`)) {
        // Skip components or special files that start with _
        if (path.includes('/_')) continue;

        const routePath = normalizeRoutePath(path, section);
        
        // Lazy load the component
        const Component = lazy(pages[path] as () => Promise<{ default: ComponentType<unknown> }>);

        routes.push({
          path: routePath,
          component: Component
        });
    }
  }

  // Sort: Static paths first, then specific dynamic, then catch-all
  return routes.sort((a, b) => {
    // Empty path (index) comes first
    if (a.path === '' && b.path !== '') return -1;
    if (a.path !== '' && b.path === '') return 1;

    const aSegments = a.path.split('/');
    const bSegments = b.path.split('/');
    
    const len = Math.max(aSegments.length, bSegments.length);
    for (let i = 0; i < len; i++) {
        const segA = aSegments[i] || '';
        const segB = bSegments[i] || '';
        
        const isDynamicA = segA.startsWith(':');
        const isDynamicB = segB.startsWith(':');
        
        if (!isDynamicA && isDynamicB) return -1;
        if (isDynamicA && !isDynamicB) return 1;
        
        if (segA < segB) return -1;
        if (segA > segB) return 1;
    }
    return 0;
  });
};
