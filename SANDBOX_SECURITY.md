# Iframe Sandbox Security in Nova

## What is Sandbox Mode?

The `sandbox` attribute in iframes is a security feature that restricts what embedded content can do. It's designed to protect your website and users from potentially malicious content.

## Current Implementation

### Smart Sandbox Detection
Our video player now automatically detects which sources require full iframe access:

```typescript
// In the iframe element
sandbox={currentSource.requiresNoSandbox ? undefined : "allow-scripts allow-same-origin allow-presentation allow-forms allow-popups allow-popups-to-escape-sandbox"}
```

### Source Configuration
Each streaming source is configured with security requirements:

```typescript
{
    id: 'multiembed',
    name: 'MultiEmbed',
    requiresNoSandbox: true,  // This source needs full access
    urls: { /* ... */ }
},
{
    id: 'pstream',
    name: 'P-Stream', 
    requiresNoSandbox: false, // This source works with restrictions
    urls: { /* ... */ }
}
```

## Security Levels

### With Sandbox (Secure)
```html
sandbox="allow-scripts allow-same-origin allow-presentation allow-forms allow-popups allow-popups-to-escape-sandbox"
```

**Allows:**
- JavaScript execution (`allow-scripts`)
- Same-origin requests (`allow-same-origin`)
- Fullscreen video (`allow-presentation`)
- Form submissions (`allow-forms`)
- Popup windows (`allow-popups`)

**Blocks:**
- Navigation to other pages
- Access to parent window
- Downloads
- Pointer lock
- Camera/microphone access

### Without Sandbox (Less Secure)
```html
<!-- No sandbox attribute -->
```

**Allows:**
- Everything the embedded content wants to do
- Full access to browser APIs
- Navigation and redirects
- Access to parent window (limited by CORS)

## Visual Indicators

### Source Selection
- ⚠️ Sources that require no sandbox show a warning icon
- Hover tooltips explain security implications
- Color coding distinguishes security levels

### Security Notice
When a no-sandbox source is selected, users see:
```
⚠️ Security Notice
This source requires unrestricted iframe access to function properly. 
Sandbox security restrictions have been disabled for this player.
```

## What Happens When You Disable Sandbox?

### Benefits
✅ More streaming sources work
✅ Better compatibility with third-party players
✅ Fewer "embedding not allowed" errors

### Risks
⚠️ Embedded content has more permissions
⚠️ Potential for unwanted redirects
⚠️ Possible popup ads
⚠️ More attack surface for malicious content

## Security Best Practices

### 1. Source Whitelisting
Only use trusted streaming sources that you've verified.

### 2. User Education
Show clear warnings when sandbox is disabled.

### 3. Regular Updates
Keep source configurations updated as services change their requirements.

### 4. Fallback Options
Always provide sandboxed alternatives when possible.

## Common Sandbox Errors

### "No sandbox mode allowed"
- Source detects and blocks sandboxed iframes
- Solution: Set `requiresNoSandbox: true` for that source

### "Embedding not permitted"
- Source blocks iframe embedding entirely
- May require API integration instead

### "This content cannot be displayed in a frame"
- X-Frame-Options header blocks embedding
- No iframe solution available

## Technical Implementation

### Type Definitions
```typescript
export interface StreamingSource {
  id: string;
  name: string;
  requiresNoSandbox?: boolean;  // New security flag
  urls: {
    movie?: string;
    tv?: string;
  };
}
```

### Security Headers
For maximum compatibility, we also set:
```html
allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
referrerPolicy="no-referrer-when-downgrade"
```

## Monitoring and Maintenance

### Source Testing
Regularly test each source to ensure:
- Videos load properly
- No unexpected redirects
- Acceptable ad behavior
- Security warnings are appropriate

### User Feedback
Monitor for reports of:
- Sources not working
- Unexpected popups
- Redirect issues
- Security concerns

### Updates
Update `requiresNoSandbox` flags as streaming services change their policies.

## Alternative Solutions

### 1. Server-Side Proxying
Route requests through your server to avoid iframe restrictions.

### 2. Direct API Integration  
Use official APIs when available instead of iframe embedding.

### 3. Progressive Enhancement
Start with sandbox, fall back to no-sandbox if needed.

### 4. User Choice
Let users choose their preferred security level.

## Conclusion

The sandbox system provides a good balance between security and functionality. Users get:
- Clear information about security implications
- Choice between secure and compatible options
- Visual indicators for informed decisions
- Fallback options when sources don't work

This approach maintains security where possible while providing compatibility when needed.
