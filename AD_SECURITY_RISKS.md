# Third-Party Ads & Security Risks in Miko

## 🚨 Why Disabling Sandbox Exposes You to Ads

When we disable iframe sandbox restrictions for streaming sources, we're essentially saying "do whatever you want" to third-party websites. This creates several ad-related security risks:

## 📊 Types of Ad Exposure

### 1. **Popup Ads** 
- **What**: New windows/tabs opening with advertisements
- **Risk Level**: Medium
- **Our Protection**: Built-in popup blocker that counts blocked attempts

### 2. **Redirect Ads**
- **What**: Entire page gets redirected to advertising sites
- **Risk Level**: High  
- **Our Protection**: Limited - can happen before we can block it

### 3. **Overlay Ads**
- **What**: Ads appear on top of the video player
- **Risk Level**: Low-Medium
- **Our Protection**: CSS containment, but not foolproof

### 4. **Click-jacking**
- **What**: Invisible elements that redirect clicks to ads
- **Risk Level**: Medium
- **Our Protection**: Basic iframe styling, user awareness

### 5. **Malicious Ads**
- **What**: Ads that contain malware, phishing, or scams
- **Risk Level**: High
- **Our Protection**: Recommend ad-blockers, security warnings

## 🛡️ Current Protective Measures

### 1. **Visual Warnings**
```tsx
// Clear security warnings with specific ad-related risks
<div className="bg-red-900 bg-opacity-40 border border-red-600">
  <p>This source may show ads, popups, or redirects</p>
  <div>• Third-party ads may appear</div>
  <div>• Popups/redirects possible</div> 
  <div>• Enhanced tracking capabilities</div>
</div>
```

### 2. **Popup Blocking**
```tsx
// Basic popup interceptor
window.open = function(...args) {
  setPopupBlocked(prev => prev + 1);
  console.log('Popup blocked from streaming source');
  return null;
};
```

### 3. **Source Classification**
```tsx
// Sources marked by risk level
{
  id: 'multiembed',
  name: 'MultiEmbed',
  requiresNoSandbox: true,  // High ad risk
}
```

### 4. **Iframe Hardening**
```tsx
// Minimal permissions even without sandbox
allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share"
referrerPolicy="no-referrer-when-downgrade"
loading="lazy"
```

## 🔍 What Users Should Know

### **When Sandbox is Enabled (Secure Sources)**
✅ **Safe**: Ads are blocked by browser security  
✅ **Protected**: No popups or redirects possible  
✅ **Limited**: Some streaming sources won't work  

### **When Sandbox is Disabled (Risky Sources)**
⚠️ **Exposed**: Third-party ads can appear  
⚠️ **Vulnerable**: Popups and redirects possible  
⚠️ **Tracked**: Enhanced user tracking capabilities  
⚠️ **Compatible**: More streaming sources work  

## 📋 User Recommendations

### 1. **Use Ad Blockers**
- **uBlock Origin** (Chrome/Firefox)
- **AdBlock Plus** 
- **Browser built-in blockers**

### 2. **Choose Secure Sources First**
- Try sources without ⚠️ warning icons first
- Only use risky sources if secure ones don't work

### 3. **Be Cautious of Clicks**
- Don't click on unexpected ads or popups
- Close any new tabs that open automatically
- Be suspicious of "You've won!" or similar messages

### 4. **Keep Browser Updated**
- Latest security patches help protect against malicious ads
- Enable popup blocking in browser settings

## 🔧 Technical Implementation Details

### Source Risk Assessment
```typescript
// Each source is evaluated for ad risks
const sourceRiskLevels = {
  'pstream': 'low',       // Well-behaved, minimal ads
  'embedsu': 'low',       // Good reputation
  'multiembed': 'high',   // Known for aggressive ads
  'moviesapi': 'medium',  // Some popup attempts
};
```

### Protection Mechanisms
```typescript
// Multi-layered protection approach
1. Visual warnings before selection
2. Runtime popup blocking
3. Iframe permission restrictions
4. User education and choice
```

## 🚀 Future Enhancements

### 1. **Smart Source Ranking**
- Rank sources by security vs compatibility
- Auto-select safest working source
- User preference learning

### 2. **Enhanced Blocking**
- Iframe content inspection
- Ad pattern detection
- Automatic source switching on ad detection

### 3. **User Control Panel**
- Security level settings (Paranoid/Balanced/Permissive)
- Source whitelist/blacklist
- Ad blocking statistics

### 4. **Alternative Solutions**
- Server-side proxy for risky sources
- Official API integrations where possible
- Premium ad-free source partnerships

## 💡 Why We Still Offer Risky Sources

### **User Choice**
Many users prefer access to more content even with ad risks

### **Transparency**
Clear warnings let users make informed decisions

### **Fallback Options**
When secure sources fail, users have alternatives

### **Real-World Usage**
Other streaming sites have similar trade-offs

## 🎯 Best Practices Summary

1. **Always try secure sources first**
2. **Use ad-blockers for protection**
3. **Read security warnings carefully**
4. **Don't click on unexpected content**
5. **Report sources with excessive ads**
6. **Keep your browser updated**

The goal is to provide maximum compatibility while keeping users informed about the risks they're taking.
