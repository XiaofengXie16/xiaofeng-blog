import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { BlogCard } from './BlogCard';

describe('BlogCard', () => {
  it('renders correctly', () => {
    const { getByText } = render(
      <MemoryRouter>
        <BlogCard name="Test Title" description="Test Description" link="#" />
      </MemoryRouter>
    );
    expect(getByText('Test Title')).toBeInTheDocument();
  });
});
