// src/data/quests.ts
// Static quest definitions
// Each quest has: id, type, title, target_post_id / target_user_id, xp

export const quests = [
  {
    id: 'like_post_1',
    type: 'like',
    title: 'Like Post Tutorial',
    target_post_id: '1234567890123456789',
    xp: 10
  },
  {
    id: 'follow_account_1',
    type: 'follow',
    title: 'Follow Official Account',
    target_user_id: '123456789',
    xp: 15
  },
  {
    id: 'retweet_post_1',
    type: 'retweet',
    title: 'Retweet Announcement',
    target_post_id: '1234567890123456790',
    xp: 20
  },
  {
    id: 'like_post_2',
    type: 'like',
    title: 'Like Community Post',
    target_post_id: '1234567890123456791',
    xp: 10
  },
  {
    id: 'follow_account_2',
    type: 'follow',
    title: 'Follow Developer Account',
    target_user_id: '987654321',
    xp: 15
  }
];
