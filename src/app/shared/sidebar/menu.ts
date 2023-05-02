import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
    // Mocca admin panel menu start
    {
        id: 101,
        label: 'Menu',
        isTitle: true
    },
    {
        id: 102,
        label: 'Dashboard',
        icon: 'home',
        link: '/',
    },
    {
        id: 103,
        label: 'User Management',
        icon: 'users',
        subItems: [
            {
                id: 104,
                label: 'User List',
                link: '/user-list',
                parentId: 103
            }
        ]
    },
    {
        id: 105,
        label: 'FAQ Management',
        icon: 'info',
        subItems: [
            {
                id: 106,
                label: 'List Topics',
                link: '/list/consultantlist',
                parentId: 105
            },
            {
                id: 107,
                label: 'List FAQs',
                link: '/list/consultantlist',
                parentId: 105
            }
        ]
    },
    {
        id: 108,
        label: 'Tournaments Management',
        icon: 'radio',
        subItems: [
            {
                id: 109,
                label: 'List Tournaments',
                link: '/list/consultantlist',
                parentId: 108
            },
            {
                id: 110,
                label: 'List Tournament History',
                link: '/list/consultantlist',
                parentId: 108
            },
            {
                id: 111,
                label: 'List Payout Request',
                link: '/list/consultantlist',
                parentId: 108
            },
            {
                id: 112,
                label: 'Team List',
                link: '/list/consultantlist',
                parentId: 108
            },
            {
                id: 113,
                label: 'Player List',
                link: '/list/consultantlist',
                parentId: 108
            }
        ]
    },
    {
        id: 114,
        label: 'VS The House Management',
        icon: 'radio',
        subItems: [
            {
                id: 115,
                label: 'Daily Player Slates',
                link: '/list/consultantlist',
                parentId: 114
            },
            {
                id: 116,
                label: 'List Contest',
                link: '/list/consultantlist',
                parentId: 114
            },
            {
                id: 117,
                label: 'List Complete Contest',
                link: '/list/consultantlist',
                parentId: 114
            },
            {
                id: 118,
                label: 'Live',
                link: '/list/consultantlist',
                parentId: 114
            },
            {
                id: 119,
                label: 'Entered',
                link: '/list/consultantlist',
                parentId: 114
            },
            {
                id: 120,
                label: 'Completed',
                link: '/list/consultantlist',
                parentId: 114
            },
            {
                id: 121,
                label: 'Settings',
                link: '/list/consultantlist',
                parentId: 114
            }
        ]
    },
    {
        id: 122,
        label: 'Transaction Management',
        icon: 'dollar-sign',
        subItems: [
            {
                id: 123,
                label: 'User Transaction',
                link: '/list/consultantlist',
                parentId: 122
            },
            {
                id: 124,
                label: 'Tournament Transaction',
                link: '/list/consultantlist',
                parentId: 122
            }
        ]
    },
    {
        id: 125,
        label: 'Contest Management',
        icon: 'file-text',
        link: '/content-list'
    },
    {
        id: 129,
        label: 'Policy Management',
        icon: 'command',
        subItems: [
            {
                id: 130,
                label: 'T&C',
                link: '/list/consultantlist',
                parentId: 129
            },
            {
                id: 131,
                label: 'Privacy Policy',
                link: '/list/consultantlist',
                parentId: 129
            },
            {
                id: 132,
                label: 'About Us',
                link: '/list/consultantlist',
                parentId: 129
            },
            {
                id: 133,
                label: 'Responsible Gaming',
                link: '/list/consultantlist',
                parentId: 129
            }
        ]
    },
    {
        id: 134,
        label: 'HOW It Work Management',
        icon: 'globe',
        subItems: [
            {
                id: 135,
                label: 'HOW It Work Rules',
                link: '/list/consultantlist',
                parentId: 134
            }
        ]
    },
    {
        id: 136,
        label: 'Settings',
        icon: 'settings',
        subItems: [
            {
                id: 137,
                label: 'Subscription',
                link: '/list/consultantlist',
                parentId: 136
            },
            {
                id: 138,
                label: 'Gneral',
                link: '/list/consultantlist',
                parentId: 136
            },
            {
                id: 139,
                label: 'Promo Code',
                link: '/list/consultantlist',
                parentId: 136
            },
            {
                id: 140,
                label: 'Promotion Code',
                link: '/list/consultantlist',
                parentId: 136
            }
        ]
    },
    {
        id: 141,
        label: 'Email Management',
        icon: 'mail',
        subItems: [
            {
                id: 142,
                label: 'Email Content',
                link: '/list/consultantlist',
                parentId: 141
            },
            {
                id: 143,
                label: 'Subscribe Users',
                link: '/list/consultantlist',
                parentId: 141
            }
        ]
    },
    {
        id: 144,
        label: 'Push Management',
        icon: 'bell',
        subItems: [
            {
                id: 145,
                label: 'Push Content',
                link: '/list/consultantlist',
                parentId: 144
            }
        ]
    },
    {
        id: 146,
        label: 'Mass Communication',
        icon: 'message-square',
        subItems: [
            {
                id: 147,
                label: 'Mass Email & App',
                link: '/list/consultantlist',
                parentId: 146
            },
            {
                id: 148,
                label: 'Mass Communication',
                link: '/list/consultantlist',
                parentId: 146
            }
        ]
    }
];

