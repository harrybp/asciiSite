var website = {
  name: 'HarryBP',
	width: 700,
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
          'I am a 20 year old Computer Science student from <a href="#" onmouseenter=openPopover("uom")>UoM</a> in my final year of studies after a placement position at HSBC in Hong Kong. I am interested in developer roles in a fast paced company.',
        ]
      },
      {
        tabName: 'Contact',
        title: 'Contact Me',
        content: [
          {
            type: 'columns',
            text1: 'email',
            text2: 'harrytbp@gmail.com',
            seperate: false
          },
          {
            type: 'columns',
            text1: 'linkedin',
            text2: '<a href="https://www.linkedin.com/in/harry-bond-preston-58399311a/">harry-bond-preston</a>',
            seperate: false
          },
          {
            type: 'columns',
            text1: 'github',
            text2: '<a href="https://github.com/harrybp">harrybp</a>',
          },
        ]
      },
      ],
      popovers: [
        {
          key: 'uom',
          content: 'The University of Manchester',
          width: 15
        }
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
            'Just some HTML5 games made by me in my spare time..',
            {
              type: 'columns',
              text1: '- Zombie Run \n A side scrolling run-and-shoot type game. My first attempt at building a HTML5 game. \n <a href="#" onclick=openPopup("1")>Click</a> to Play',
              text2: '- Bounce \n Keep the ball from escaping! My second game, simpler but more mathematically complex. \n <a href="#" onclick=openPopup("2")>Click</a> to Play'
            },
            'Check my <a href="https://github.com/harrybp">github</a> for more stuff'
          ]
        },
        {
          tabName: 'Other',
          title: 'Other',
          content: [
            'This website: A text-only interactive website built using javascript. At the moment has support for a navbar, tabs, pop-ups, pop-overs and columns of text. Check it on github..'
          ]
        }
      ],
      popups: [
        {
          title: 'Zombie Run! [coming soon]',
          width: 35,
          position: 3
        },
        {
          title: 'Bounce! [coming soon]',
          width: 35,
          position: 3
        }
      ]
    }
	]
}