import FeedReelScrollScreen from '../screens/reel/FeedReelScrollScreen';
// import ReelScrollScreen from '../screens/reel/ReelScrollScreen';

export const dashboardStack = [
  {
    name: 'FeedReelScrollScreen',
    component: FeedReelScrollScreen,
  },
  // {
  //   name: 'ReelScrollScreen',
  //   component: ReelScrollScreen,
  // },
];

export const mergedStacks = [...dashboardStack];
