export default {
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}",
  ],
	theme: {
		extend: {
			// 自定义网格列数
			gridTemplateColumns: {
				'13': 'repeat(13, minmax(0, 1fr))',
				'14': 'repeat(14, minmax(0, 1fr))',
				'16': 'repeat(16, minmax(0, 1fr))',
				// 自定义复杂布局
				'custom': '400px 1fr 350px',
				'sidebar': '250px 1fr',
			},
			// 自定义网格行数
			gridTemplateRows: {
				'20': 'repeat(20, minmax(0, 1fr))',
				'custom': 'auto 1fr auto',
				'component': 'repeat(auto-fill, 115px)',
				'header': '60px 1fr',
			},
			// 自定义网格间隙
			gridGap: {
				'18': '4.5rem',
				'88': '22rem',
			},
			// 自定义网格区域
			gridTemplateAreas: {
				'layout': '"header header" "sidebar main" "footer footer"',
				'dashboard': '"nav nav nav" "sidebar main stats" "sidebar main stats"',
			},
		}
	}
}