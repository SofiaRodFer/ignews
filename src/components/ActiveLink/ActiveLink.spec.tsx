import { render } from '@testing-library/react'
import { ActiveLink } from '.'

beforeEach(() => {
    const useRouter = jest.spyOn(require('next/router'), 'useRouter');

    useRouter.mockImplementationOnce(() => ({
      asPath: '/'
    }));
});

describe('ActiveLink component', () => {
    it('renders correctly', () => {
        const { getByText } = render(
            <ActiveLink href="/" activeClassName='active'>
                <a href="#">Home</a>
            </ActiveLink>
        )
    
        expect(getByText('Home')).toBeInTheDocument()
    })
    
    it('adds active class if the link is currently active', () => {
        const { getByText } = render(
            <ActiveLink href="/" activeClassName='active'>
                <a href="#">Home</a>
            </ActiveLink>
        )
    
        expect(getByText('Home')).toHaveClass('active')
    })
})

