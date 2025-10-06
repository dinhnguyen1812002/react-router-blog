# Avatar Upload Feature Documentation

## Overview

The Avatar Upload feature provides a complete solution for users to upload and manage their profile avatars. It includes drag-and-drop support, client-side validation, image compression, progress tracking, and responsive design.

## Features

### ✅ Core Functionality
- **Drag & Drop Support**: Users can drag images directly onto the upload area
- **File Input**: Traditional file selection via button click
- **Image Preview**: Real-time preview of selected images before upload
- **Progress Tracking**: Visual progress bar during upload process
- **Error Handling**: Comprehensive error messages for various failure scenarios

### ✅ Validation & Security
- **File Type Validation**: Only accepts JPG, JPEG, PNG, and GIF files
- **File Size Validation**: Maximum 5MB file size limit
- **Image Dimension Validation**: Minimum 100x100px, maximum 2000x2000px
- **Client-side Validation**: Immediate feedback without server round-trips
- **Server-side Security**: File type validation on both client and server

### ✅ User Experience
- **Image Compression**: Automatic compression for files larger than 2MB
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Accessibility**: Full keyboard navigation and screen reader support
- **Loading States**: Clear visual feedback during upload process
- **Error Recovery**: Easy cancellation and retry options

## Technical Implementation

### Components

#### AvatarUpload Component
```typescript
interface AvatarUploadProps {
  currentAvatarUrl?: string;    // Current avatar URL to display
  fallbackText: string;         // Fallback text for avatar (usually first letter of username)
  onSuccess?: (avatarUrl: string) => void;  // Callback when upload succeeds
  className?: string;           // Additional CSS classes
}
```

#### Key Features:
- **State Management**: Uses React hooks for local state management
- **File Validation**: Async validation with dimension checking
- **Image Compression**: Canvas-based compression for large files
- **Progress Tracking**: Real-time upload progress with percentage
- **Error Handling**: Comprehensive error states and user feedback

### API Integration

#### Upload Process:
1. **File Selection**: User selects or drags an image file
2. **Client Validation**: File type, size, and dimension validation
3. **Image Processing**: Compression if file is too large
4. **Upload**: File upload using existing `/upload` API with progress tracking
5. **Profile Update**: Update user profile with new avatar URL using existing `updateProfile` API
6. **State Sync**: Update auth store and invalidate queries

#### API Endpoints Used:
- `POST /upload` - File upload endpoint (from existing uploads API)
- `PUT /user/profile` - Update user profile with new avatar URL (existing API)

### File Validation Rules

```typescript
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MIN_DIMENSIONS = 100;            // 100x100px minimum
const MAX_DIMENSIONS = 2000;           // 2000x2000px maximum
const ALLOWED_TYPES = [
  'image/jpeg', 
  'image/jpg', 
  'image/png', 
  'image/gif'
];
```

### Image Compression

The component automatically compresses images larger than 2MB:
- **Target Size**: Maximum 800px width/height
- **Quality**: 80% JPEG quality
- **Format Preservation**: Maintains original file format
- **Canvas-based**: Uses HTML5 Canvas for compression

## Usage Examples

### Basic Usage
```tsx
import { AvatarUpload } from '~/components/profile/AvatarUpload';

function ProfilePage() {
  return (
    <AvatarUpload
      currentAvatarUrl={user.avatarUrl}
      fallbackText={user.username.charAt(0)}
      onSuccess={(avatarUrl) => {
        console.log('Avatar updated:', avatarUrl);
      }}
    />
  );
}
```

### With Custom Styling
```tsx
<AvatarUpload
  currentAvatarUrl={user.avatarUrl}
  fallbackText={user.username.charAt(0)}
  onSuccess={handleAvatarUpdate}
  className="my-custom-class"
/>
```

## Accessibility Features

### Keyboard Navigation
- **Tab Navigation**: Full keyboard accessibility
- **Enter/Space**: Trigger file selection
- **Focus Management**: Clear focus indicators

### Screen Reader Support
- **ARIA Labels**: Descriptive labels for all interactive elements
- **Role Attributes**: Proper roles for progress bars and alerts
- **Live Regions**: Dynamic content updates announced to screen readers

### Visual Accessibility
- **High Contrast**: Clear visual distinction between states
- **Focus Indicators**: Visible focus rings for keyboard navigation
- **Error States**: Clear error messaging with appropriate colors

## Responsive Design

### Breakpoints
- **Mobile**: Stacked layout with smaller avatar and compact controls
- **Tablet**: Balanced layout with medium-sized elements
- **Desktop**: Full layout with larger avatar and spacious controls

### Mobile Optimizations
- **Touch-friendly**: Large touch targets for mobile devices
- **Simplified UI**: Streamlined interface for smaller screens
- **Performance**: Optimized for mobile network conditions

## Error Handling

### Client-side Errors
- **Invalid File Type**: Clear message about supported formats
- **File Too Large**: Size limit information with MB conversion
- **Image Too Small**: Dimension requirements with pixel values
- **Image Too Large**: Maximum dimension limits
- **Network Errors**: Connection and upload failure handling

### Server-side Errors
- **Upload Failures**: Server error messages with retry options
- **Authentication**: Token expiration and re-authentication
- **Storage Errors**: Server storage capacity and permission issues

## Performance Considerations

### Optimization Strategies
- **Lazy Loading**: Components load only when needed
- **Image Compression**: Automatic compression for large files
- **Memory Management**: Proper cleanup of preview URLs
- **Debounced Validation**: Efficient validation without excessive processing

### Network Optimization
- **Progress Tracking**: Real-time upload progress
- **Retry Logic**: Automatic retry for failed uploads
- **Timeout Handling**: Appropriate timeouts for slow connections

## Security Considerations

### File Validation
- **MIME Type Checking**: Server-side file type validation
- **File Header Validation**: Magic number verification
- **Size Limits**: Strict file size enforcement
- **Dimension Limits**: Image dimension validation

### Upload Security
- **CSRF Protection**: Cross-site request forgery prevention
- **Authentication**: User authentication required for uploads
- **Rate Limiting**: Upload frequency restrictions
- **Virus Scanning**: Server-side malware detection (recommended)

## Testing

### Unit Tests
- Component rendering and state management
- File validation logic
- Image compression functionality
- Error handling scenarios

### Integration Tests
- Upload flow end-to-end
- API integration
- State synchronization
- Error recovery

### Manual Testing Checklist
- [ ] Drag and drop functionality
- [ ] File input selection
- [ ] Image preview display
- [ ] Upload progress tracking
- [ ] Error message display
- [ ] Success state handling
- [ ] Mobile responsiveness
- [ ] Keyboard navigation
- [ ] Screen reader compatibility

## Browser Support

### Supported Browsers
- **Chrome**: 90+ (Full support)
- **Firefox**: 88+ (Full support)
- **Safari**: 14+ (Full support)
- **Edge**: 90+ (Full support)

### Feature Support
- **Drag & Drop**: Modern browsers with HTML5 support
- **File API**: File input and preview functionality
- **Canvas**: Image compression and processing
- **Fetch API**: Upload progress tracking

## Future Enhancements

### Planned Features
- **Batch Upload**: Multiple avatar options
- **Avatar Cropping**: Built-in image cropping tool
- **Avatar Templates**: Pre-designed avatar templates
- **Social Integration**: Import from social media platforms

### Performance Improvements
- **WebP Support**: Modern image format support
- **Lazy Loading**: Deferred image loading
- **CDN Integration**: Content delivery network support
- **Caching**: Intelligent caching strategies

## Troubleshooting

### Common Issues

#### Upload Fails
- Check file size and format requirements
- Verify network connection
- Ensure user authentication
- Check server storage capacity

#### Preview Not Showing
- Verify file format support
- Check browser compatibility
- Ensure proper file selection
- Clear browser cache

#### Validation Errors
- Confirm file type is supported
- Check file size limits
- Verify image dimensions
- Ensure file is not corrupted

### Debug Information
- Browser console logs for client-side issues
- Network tab for upload progress
- Server logs for backend issues
- User agent information for compatibility

## Support

For technical support or feature requests:
- Check the component documentation
- Review the API integration guide
- Test with the demo component
- Contact the development team

---

*Last updated: [Current Date]*
*Version: 1.0.0*
