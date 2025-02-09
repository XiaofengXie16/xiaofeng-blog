import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import BlogCard from './BlogCard';

describe('BlogCard', () => {
    it('renders correctly', () => {
        const { getByText } = render(<BlogCard title="Test Title" />);
        expect(getByText('Test Title')).toBeInTheDocument();
    });
});