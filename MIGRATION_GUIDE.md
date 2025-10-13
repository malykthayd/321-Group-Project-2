# Migration Guide - Import Path Updates

## Overview
After reorganizing the project structure, some import paths may need to be updated. This guide helps identify and fix common import path issues.

## Common Import Path Changes

### Backend Files
**Old paths → New paths:**

```typescript
// Before
import { auth } from '../lib/auth'
import { database } from '../lib/database'

// After
import { auth } from '../middleware/auth'
import { database } from '../services/database'
```

### Frontend Files
**Old paths → New paths:**

```typescript
// Before
import AuthProvider from '../components/AuthProvider'
import '../app/globals.css'

// After
import AuthProvider from '../components/AuthProvider'
import '../styles/globals.css'
```

### Configuration Files
**Old paths → New paths:**

```bash
# Before
npm run build
tailwind.config.js

# After
cd data/config && npm run build
data/config/tailwind.config.js
```

## Files That May Need Updates

### 1. TypeScript/JavaScript Files
- Check all `.ts` and `.tsx` files for import statements
- Update relative paths to match new structure
- Verify that all imports resolve correctly

### 2. Configuration Files
- Update `package.json` scripts if they reference specific paths
- Check `next.config.js` for any path references
- Verify `tsconfig.json` path mappings

### 3. HTML Files
- Update any script or CSS references in HTML files
- Check for relative paths to assets
- Verify PWA manifest paths

## Quick Fix Commands

```bash
# Find all import statements that may need updating
grep -r "from.*lib/" backend/ frontend/
grep -r "from.*app/" backend/ frontend/
grep -r "from.*components/" frontend/

# Find all require statements
grep -r "require.*lib/" backend/ frontend/
grep -r "require.*app/" backend/ frontend/
```

## Testing After Migration

1. **Build Test**: Run the build process to check for missing imports
2. **Runtime Test**: Start the development server and test all functionality
3. **Import Test**: Verify all imports resolve correctly
4. **Asset Test**: Check that all assets load properly

## Common Issues and Solutions

### Issue: Module not found
**Solution**: Update the import path to match the new file location

### Issue: Build errors
**Solution**: Check that all configuration files reference correct paths

### Issue: Runtime errors
**Solution**: Verify that all dynamic imports and asset references are correct

## Rollback Plan

If issues arise, the original structure can be restored by:
1. Moving files back to their original locations
2. Updating import paths back to original values
3. Testing functionality

## Support

If you encounter issues during migration:
1. Check the console for specific error messages
2. Verify file paths are correct
3. Test imports individually
4. Check configuration files for path references
