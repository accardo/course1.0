import Vue from 'vue'
import Router from 'vue-router'

const index = r => require.ensure([], () => r(require('../page/home/index')), 'index')
const details = r => require.ensure([], () => r(require('../page/courseDetails/details')), 'details')

const member = r => require.ensure([], () => r(require('../page/member/member')), 'member')
const myInfo = r => require.ensure([], () => r(require('../page/member/myInfo')), 'myInfo')

const bookeDetails = r => require.ensure([], () => r(require('../page/member/bookeDetails')), 'bookeDetails')
const contract = r => require.ensure([], () => r(require('../page/member/contract')), 'contract')
const notice = r => require.ensure([], () => r(require('../page/member/notice')), 'notice')

const notMember = r => require.ensure([], () => r(require('../page/member/notMember')), 'notMember')

const entrance = r => require.ensure([], () => r(require('../page/member/entrance')), 'entrance')
const AMap = r => require.ensure([], () => r(require('../page/map/AMap')), 'AMap')
const expShop = r => require.ensure([], () => r(require('../page/member/expShop')), 'expShop')


Vue.use(Router)

export default new Router({
	mode: 'hash',
	// base: '/daydaycook/page/course/',
	routes: [
		{
			path: '/',
			name: 'index',
			component: index
		},
        {
            path: '/index',
            name: 'index',
            component: index
        },
        {
            path: '/details',
            name: 'details',
            component: details
        },
        {
            path: '/member',
            name: 'member',
            meta: {
               requireAuth: true,
            },
            component: member
        },
        {
            path: '/notMember',
            name: 'notMember',
            component: notMember,
	        meta: {
		        requireAuth: false,
	        },
        },
        {
            path: '/myInfo',
            name: 'myInfo',
            meta: {
               requireAuth: true,
            },
            component: myInfo
        },
        {
            path: '/bookeDetails',
            name: 'bookeDetails',
            meta: {
               requireAuth: true,
            },
            component: bookeDetails
        },
        {
            path: '/contract',
            name: 'contract',
            meta: {
               requireAuth: true,
            },
            component: contract
        },
        {
            path: '/notice',
            name: 'notice',
            meta: {
               requireAuth: true,
            },
            component: notice
        },
        {
            path: '/entrance',
            name: 'entrance',
            meta: {
               requireAuth: false,
            },
            component: entrance
        },
		{
            path: '/AMap',
            name: 'AMap',
            meta: {
               requireAuth: false,
            },
            component: AMap
        },
		{
            path: '/expShop',
            name: 'expShop',
            meta: {
               requireAuth: false,
            },
            component: expShop
        }
	]
})
