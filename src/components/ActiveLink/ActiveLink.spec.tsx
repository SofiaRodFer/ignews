import { render, screen } from '@testing-library/react'
import { ActiveLink } from '.'
import { jest } from '@jest/globals'

beforeEach(() => {
    const useRouter = jest.spyOn(require('next/router'), 'useRouter');

    useRouter.mockImplementationOnce(() => ({
      asPath: '/'
    }));
});

describe('ActiveLink component', () => {
    it('renders correctly', () => {
        render(
            <ActiveLink href="/" activeClassName='active'>
                <a href="#">Home</a>
            </ActiveLink>
        )
    
        expect(screen.getByText('Home')).toBeInTheDocument()
    })
    
    it('adds active class if the link is currently active', () => {
        render(
            <ActiveLink href="/" activeClassName='active'>
                <a href="#">Home</a>
            </ActiveLink>
        )
    
        expect(screen.getByText('Home')).toHaveClass('active')
    })
})

