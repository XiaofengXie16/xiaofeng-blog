import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ToolCard } from './ToolCard';

describe('ToolCard', () => {
  const mockProps = {
    icon: '/test-icon.svg',
    name: 'Test Tool',
    description: 'This is a test tool description',
    category: 'Test Category',
    link: 'https://example.com'
  };

  it('renders correctly with all props', () => {
    render(<ToolCard {...mockProps} />);

    expect(screen.getByText('Test Tool')).toBeInTheDocument();
    expect(screen.getByText('This is a test tool description')).toBeInTheDocument();
    expect(screen.getByText('Test Category')).toBeInTheDocument();
  });

  it('renders the icon with correct attributes', () => {
    render(<ToolCard {...mockProps} />);

    const icon = screen.getByAltText('Test Tool');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('src', '/test-icon.svg');
  });

  it('renders the link with correct href', () => {
    render(<ToolCard {...mockProps} />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', 'https://example.com');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('applies hover effects classes', () => {
    render(<ToolCard {...mockProps} />);

    const card = screen.getByRole('link');
    expect(card).toHaveClass('transition-all', 'duration-200');
  });
});
