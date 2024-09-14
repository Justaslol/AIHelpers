export interface AIHelper {
    id: string;
    name: string;
    description: string;
    image: any; // Update this type if using remote images
  }

export const aiHelpers: AIHelper[] = [
    {
      id: 'assistant_1',
      name: 'Soshie',
      description: 'Your friendly helper',
      image: require('../assets/assistant1.png'),
    },
    {
      id: 'assistant_2',
      name: 'Cassie',
      description: 'Expert in languages',
      image: require('../assets/assistant2.png'),
    },
    {
      id: 'assistant_3',
      name: 'Scouty',
      description: 'Math genius',
      image: require('../assets/assistant3.png'),
    },
    {
      id: 'assistant_4',
      name: 'Puzzy',
      description: 'Science guru',
      image: require('../assets/assistant4.png'),
    },
    {
      id: 'assistant_5',
      name: 'Milli',
      description: 'History buff',
      image: require('../assets/assistant5.png'),
    },
    {
      id: 'assistant_6',
      name: 'Commie',
      description: 'Art expert',
      image: require('../assets/assistant6.png'),
    },
  ];