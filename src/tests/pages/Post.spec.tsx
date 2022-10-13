import { render, screen } from '@testing-library/react'
import { jest } from '@jest/globals'

import Posts, { getServerSideProps } from '../../pages/posts/[slug]'
import { getSession } from 'next-auth/react'
import { getPrismicClient } from '../../services/prismic'

const post = {
    slug: 'my-new-post',
    title: 'My new post',
    content: '<p>Post excerpt</p>',
    updatedAt: '10 de Março',
}

jest.mock('next-auth/react')
jest.mock('../../services/prismic')

describe('Post page', () => {
    it('render correctly', () => {
        render(<Posts post={post} />)

        expect(screen.getByText('My new post')).toBeInTheDocument()
        expect(screen.getByText('Post excerpt')).toBeInTheDocument()
    })

    it('redirects user if no subscription is found', async () => {
        const getSessionMocked = jest.mocked(getSession)

        getSessionMocked.mockResolvedValueOnce({
            activeSubcription: null
        } as any)

        const response = await getServerSideProps({
            params: {
                slug: 'my-new-post'
            }
        } as any)

        expect(response).toEqual(
            expect.objectContaining({
                redirect: expect.objectContaining({
                    destination: '/',
                })
            })
        )
    })

    it('loads initial data', async () => {
        const getSessionMocked = jest.mocked(getSession)
        const getPrismicClientMocked = jest.mocked(getPrismicClient)

        getPrismicClientMocked.mockReturnValueOnce({
                getByUID: jest.fn().mockResolvedValueOnce({
                    data: {
                        title: [
                            { type: 'heading', text: 'My new post' }
                        ],
                        content: [
                            { type: 'paragraph', text: 'my post content' }
                        ],
                    },
                    last_publication_date: '04-01-2022'
                })
        } as any)

        getSessionMocked.mockResolvedValueOnce({
            activeSubcription: 'fake-active-subscription'
        } as any)

        const response = await getServerSideProps({
            params: {
                slug: 'my-new-post'
            }
        } as any)

        expect(response).toEqual(
            expect.objectContaining({
                props: {
                    post: {
                        slug: 'my-new-post',
                        title: 'My new post',
                        content: '<p>my post content</p>',
                        updated_at: '01 de abril de 2022'
                    }
                }
            })
        )
    })
})