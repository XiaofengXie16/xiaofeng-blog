import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
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
    const { getByText } = render(<ToolCard {...mockProps} />);

    expect(getByText('Test Tool')).toBeInTheDocument();
    expect(getByText('This is a test tool description')).toBeInTheDocument();
    expect(getByText('Test Category')).toBeInTheDocument();
  });

  it('renders the icon with correct attributes', () => {
    const { getByAltText } = render(<ToolCard {...mockProps} />);

    const icon = getByAltText('Test Tool');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('src', '/test-icon.svg');
  });

  it('renders the link with correct href', () => {
    const { getByRole } = render(<ToolCard {...mockProps} />);

    const link = getByRole('link');
    expect(link).toHaveAttribute('href', 'https://example.com');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('applies hover effects classes', () => {
    const { getByRole } = render(<ToolCard {...mockProps} />);

    const card = getByRole('link');
    expect(card).toHaveClass('transition-all', 'duration-200');
  });
});
