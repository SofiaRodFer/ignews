import { render, screen } from '@testing-library/react'
import { jest } from '@jest/globals'
import { useRouter } from 'next/router'

import Posts, { getStaticProps } from '../../pages/posts/preview/[slug]'
import { getSession, useSession } from 'next-auth/react'
import { getPrismicClient } from '../../services/prismic'

const post = {
    slug: 'my-new-post',
    title: 'My new post',
    content: '<p>Post excerpt</p>',
    updatedAt: '10 de Março',
}

jest.mock('next-auth/react')
jest.mock('../../services/prismic')
jest.mock('next/router')

describe('Post preview page', () => {
    it('render correctly', () => {
        const useSessionMocked = jest.mocked(useSession)

        useSessionMocked.mockReturnValueOnce([null, false] as any)
        render(<Posts post={post} />)

        expect(screen.getByText('My new post')).toBeInTheDocument()
        expect(screen.getByText('Post excerpt')).toBeInTheDocument()
        expect(screen.getByText('Wanna continue reading?')).toBeInTheDocument()
    })

    it('redirects user to full post when user is subscribed', async () => {
        const useSessionMocked = jest.mocked(useSession)
        const useRouterMocked = jest.mocked(useRouter)
        const pushMock = jest.fn()

        useSessionMocked.mockReturnValueOnce([
            {
                activeSubscription: 'fake-active-subscription'
            },
            false
        ] as any)

        useRouterMocked.mockReturnValueOnce({
            push: pushMock
        } as any)

        render(<Posts post={post} />)

        expect(pushMock).toHaveBeenCalledWith('/posts/my-new-post')
    })

    it('loads initial data', async () => {
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

        const response = await getStaticProps({ params: { slug: 'my-new-post' } })

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