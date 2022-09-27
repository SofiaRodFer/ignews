import * as prismic from '@prismicio/client'

export function getPrismicClient() {
    const prismicClient = prismic.createClient(
        process.env.PRISMIC_REPO_NAME,
        {
            accessToken: process.env.PRISMIC_ACCESS_TOKEN,
            routes: [
                {
                    type: 'post',
                    path: '/posts'
                }
            ]
        }
    )

    return prismicClient
}

