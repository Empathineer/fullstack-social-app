// NOTE: This file is only for reference and does not affect the code
// Outline how data will be structured.

let db = {
    users: [
        {
            createdAt: '2021-01-16T22:07:34.109Z',
            email: 'floRida@email.com',
            handle: 'theone',
            imageUrl: 'https://firebasestorage.googleapis.com/v0/b/dummysandbox-9b7c0.appspot.com/o/33904101737.jpg?alt=media',
            userId: 'Jj4eX2cn1wUqOWQPH8NSOl6xFZK2',
            bio: 'Hello, my name is floRida. Happy learning!',
            website: 'http://user.com',
            location: 'Hollywood, CA'
        }
    ],
    screams: [
        {
            userHandle: 'dummy',
            body: 'this is the scream body',
            createdAt: '2021-01-12T23:19:07.043Z',
            likeCount: 5,
            commentCount: 2
        }
    ],
    comments: [
        {
            userHandle: 'user', // can identify who submitted the comment
            screamId: 'kdjsfgdksuufhgkdsufky', // refers to which scream it pertains to, how the comments of the scream are retrieved 
            body: 'nice one mate',
            createdAt: '2019-03-15T10:59:52.798Z'
        }
    ]
};

const userDetails = { 
    // Redux data: user data for client 
    credentials: { // to be shown on profile 
        userId: "Jj4eX2cn1wUqOWQPH8NSOl6xFZK2",
        email: "floRida@email.com",
        handle: "theone",
        createdAt: "2021-01-16T22:07:34.109Z",
        imageUrl: "https://firebasestorage.googleapis.com/v0/b/dummysandbox-9b7c0.appspot.com/o/33904101737.jpg?alt=media",
        bio: "Hello, my name is floRida. Happy learning!",
        website: "https://google.com",
        location: "New York, New York"

    },
    likes: [ // checks the page whether any posts are liked --> change icon if true
        {
            userHandle: 'user',
            screamId: '5iueQIsip4tZ4Cm5fM14'
        },
        {
            userHandle: 'user',
            screamId: 'YxWFr6nO699cnv6aoUeh'
        }
    ]
}