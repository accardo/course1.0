export const course = {
	pick: 1,
	title: '条件',
	list: [
		{
			id: 1,
			name: '可预约课程',
			isActive: false
		},
		{
			id: 2,
			name: '已预约课程',
			isActive: false
		}
	]
}

export const time = {
	pick: 1,
	title: '时间',
	list: [
		{
			id: 1,
			name: '最近7天',
			isActive: false
		},
		{
			id: 2,
			name: '最近14天',
			isActive: false
		},
		{
			id: 3,
			name: '最近30天',
			isActive: false
		},
		{
			id: 4,
			name: '只看周末',
			isActive: false
		}
	]
}
export default {
	course,
	time
}
