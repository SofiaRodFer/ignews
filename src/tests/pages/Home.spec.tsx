import { render, screen } from '@testing-library/react'
import { stripe } from '../../services/stripe'
import { jest } from '@jest/globals'

import Home, { getStaticProps } from '../../pages'

jest.mock('next/router')
jest.mock('next-auth/react', () => {
    return {
        useSession: () => [null, false]
    }
})
jest.mock('../../services/stripe')

describe('Home page', () => {
    it('render correctly', () => {
        render(<Home product={{priceId: 'fakepriceid', amount: 'R$10,00'}} />)

        expect(screen.getByText('for R$10,00 month')).toBeInTheDocument()
    })

    it('loads initial data', async () => {
        const retrieveStripePricesMocked = jest.mocked(stripe.prices.retrieve)

        retrieveStripePricesMocked.mockResolvedValueOnce({
            id: 'fakepriceid',
            unit_amount: 1000,
        } as any)

        const response = await getStaticProps({})

        expect(response).toEqual(
            expect.objectContaining({
                props: {
                    product: {
                        priceId: 'fakepriceid',
                        amount: '$10.00'
                    }
                }
            })
        )
    })
})