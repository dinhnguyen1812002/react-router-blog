// Example test file for ProfileHeader component
// Note: This requires testing dependencies to be installed
// Run: npm install --save-dev @testing-library/react @testing-library/jest-dom vitest

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import { ProfileHeader } from '../ProfileHeader';
import type { ProfileUser } from '~/types';

// Mock user data
const mockUser: ProfileUser = {
  id: '1',
  username: 'testuser',
  email: 'test@example.com',
  avatar: '',
  roles: ['ROLE_USER'],
  bio: 'Test bio',
  socialMediaLinks: {
    LINKEDIN: 'https://linkedin.com/in/testuser',
    TWITTER: 'https://twitter.com/testuser',
  },
  postsCount: 5,
  savedPostsCount: 3,
  commentsCount: 10,
  customProfileMarkdown: null,
};

const mockAdminUser: ProfileUser = {
  ...mockUser,
  roles: ['ROLE_USER', 'ROLE_ADMIN'],
};

// Wrapper component for router context
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('ProfileHeader', () => {
  it('renders user information correctly', () => {
    render(
      <TestWrapper>
        <ProfileHeader user={mockUser} />
      </TestWrapper>
    );

    expect(screen.getByText('testuser')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('Test bio')).toBeInTheDocument();
  });

  it('shows admin badge for admin users', () => {
    render(
      <TestWrapper>
        <ProfileHeader user={mockAdminUser} />
      </TestWrapper>
    );

    expect(screen.getByText('Admin')).toBeInTheDocument();
  });

  it('shows edit button for own profile', () => {
    const mockOnEdit = vi.fn();
    
    render(
      <TestWrapper>
        <ProfileHeader 
          user={mockUser} 
          isOwnProfile={true} 
          onEditClick={mockOnEdit}
        />
      </TestWrapper>
    );

    expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
  });

  it('shows follow button for other profiles', () => {
    render(
      <TestWrapper>
        <ProfileHeader user={mockUser} isOwnProfile={false} />
      </TestWrapper>
    );

    expect(screen.getByRole('button', { name: /follow/i })).toBeInTheDocument();
  });

  it('shows correct action buttons for own profile', () => {
    render(
      <TestWrapper>
        <ProfileHeader user={mockUser} isOwnProfile={true} />
      </TestWrapper>
    );

    expect(screen.getByRole('link', { name: /edit profile/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /view public profile/i })).toBeInTheDocument();
  });

  it('does not show edit button when showEditButton is false', () => {
    render(
      <TestWrapper>
        <ProfileHeader 
          user={mockUser} 
          isOwnProfile={true} 
          showEditButton={false}
        />
      </TestWrapper>
    );

    expect(screen.queryByRole('button', { name: /edit/i })).not.toBeInTheDocument();
  });
});

// Example test for ProfileStats component
describe('ProfileStats', () => {
  it('displays correct statistics', () => {
    const { ProfileStats } = require('../ProfileStats');
    
    render(<ProfileStats user={mockUser} />);

    expect(screen.getByText('5')).toBeInTheDocument(); // Posts count
    expect(screen.getByText('3')).toBeInTheDocument(); // Saved posts count
    expect(screen.getByText('10')).toBeInTheDocument(); // Comments count
    expect(screen.getByText('Posts')).toBeInTheDocument();
    expect(screen.getByText('Saved')).toBeInTheDocument();
    expect(screen.getByText('Comments')).toBeInTheDocument();
  });
});

// Example test for SocialLinks component
describe('SocialLinks', () => {
  it('renders social media links correctly', () => {
    const { SocialLinks } = require('../SocialLinks');
    
    render(<SocialLinks socialMediaLinks={mockUser.socialMediaLinks} />);

    const linkedinLink = screen.getByRole('link', { name: /linkedin profile/i });
    const twitterLink = screen.getByRole('link', { name: /twitter profile/i });

    expect(linkedinLink).toHaveAttribute('href', 'https://linkedin.com/in/testuser');
    expect(twitterLink).toHaveAttribute('href', 'https://twitter.com/testuser');
    expect(linkedinLink).toHaveAttribute('target', '_blank');
    expect(linkedinLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('does not render when no social links are provided', () => {
    const { SocialLinks } = require('../SocialLinks');
    
    const { container } = render(<SocialLinks socialMediaLinks={{}} />);
    
    expect(container.firstChild).toBeNull();
  });
});

// Example test for markdown validation
describe('Markdown Validation', () => {
  it('validates markdown content length', async () => {
    const { validateMarkdownContent } = await import('~/utils/markdown');
    
    const longContent = 'a'.repeat(10001);
    const validation = validateMarkdownContent(longContent);
    
    expect(validation.isValid).toBe(false);
    expect(validation.errors).toContain('Content must be less than 10,000 characters');
  });

  it('detects dangerous content', async () => {
    const { validateMarkdownContent } = await import('~/utils/markdown');
    
    const dangerousContent = '<script>alert("xss")</script>';
    const validation = validateMarkdownContent(dangerousContent);
    
    expect(validation.isValid).toBe(false);
    expect(validation.errors).toContain('Content contains potentially unsafe elements');
  });

  it('allows safe markdown content', async () => {
    const { validateMarkdownContent } = await import('~/utils/markdown');
    
    const safeContent = '# Hello\n\nThis is **safe** markdown content.';
    const validation = validateMarkdownContent(safeContent);
    
    expect(validation.isValid).toBe(true);
    expect(validation.errors).toHaveLength(0);
  });
});
