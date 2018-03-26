var website = {
  name: 'HarryBP',
	width: 600,
	padding: '|',
	pages: [
		{
			title: 'About Me',
      link: 'aboutme.html',
      tabs: [
      {
        tabName: 'Info',
        title: 'Information',
        content: [
          'blah',
          {
            type: 'columns',
            text1: 'yo',
            text2: 'no'
          }
        ]
      },
      {
        tabName: 'Contact',
        title: 'Contact Me',
        content: [
          'bla2'
        ]
      },
      ]
		},
    {
      title: 'Web Projects',
      link: 'projects.html',
      tabs: [
        {
          tabName: 'Games',
          title: 'Games',
          content: [
            'I have made two HTML5 games in the past year, both are unfinished but playable..',
            {
              type: 'columns',
              text1: '- Zombie Run \n A side scrolling run-and-shoot type game. My first attempt at building a HTML5 game. \n <a href="#" onclick=openPopup("1")>Click</a> to Play',
              text2: '- Bounce \n Keep the ball from escaping! My second game, simpler but more mathematically complex. \n <a href="#" onclick=openPopup("2")>Click</a> to Play'
            },
            'More games coming soon most likely..'
          ]
        },
        {
          tabName: 'Other',
          title: 'Other',
          content: []
        }
      ],
      popups: [
        {
          title: 'Zombie Run!',
          width: 35,
          position: 3
        },
        {
          title: 'Bounce!',
          width: 35,
          position: 3
        }
      ]
    }
	]
}