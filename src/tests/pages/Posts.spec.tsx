import { render, screen } from '@testing-library/react'
import { jest } from '@jest/globals'
import { getPrismicClient } from '../../services/prismic'

import Posts, { getStaticProps } from '../../pages/posts'

const posts = [
    {
        slug: 'my-new-post',
        title: 'My new post',
        excerpt: 'Post excerpt',
        updatedAt: '10 de Março',
    }
]

jest.mock('../../services/prismic')

describe('Posts page', () => {
    it('render correctly', () => {
        render(<Posts posts={posts} />)

        expect(screen.getByText('My new post')).toBeInTheDocument()
    })

    it('loads initial data', async () => {
        const getPrismicClientMocked = jest.mocked(getPrismicClient)

        getPrismicClientMocked.mockReturnValueOnce({
            query: jest.fn().mockResolvedValueOnce({
                results: [
                    {
                        uuid: 'my-new-post',
                        data: {
                            title: [
                                { type: 'heading', text: 'My new post' }
                            ],
                            content: [
                                { type: 'paragraph', text: 'my post content' }
                            ],
                        },
                        last_publication_date: '04-01-2022',
                    }
                ]
            })
        } as any)

        const response = await getStaticProps({})

        expect(response).toEqual(
            expect.objectContaining({
                props: {
                    posts: [{
                        slug: 'my-new-post',
                        title: 'My new post',
                        excerpt: 'Post excerpt',
                        updatedAt: '01 de abril de 2022'
                    }]
                }
            })
        )
    })
})