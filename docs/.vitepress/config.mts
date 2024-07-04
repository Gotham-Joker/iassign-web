import {defineConfig} from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: "IASSIGN",
    description: "一款开源的低代码工作流引擎",
    themeConfig: {
        // https://vitepress.dev/reference/default-theme-config
        nav: [
            {text: 'Home', link: '/'},
            {text: 'Examples', link: '/guide/examples'}
        ],

        sidebar: [
            {
                text: '功能(Features)',
                link: '/product_feature',
                items: [
                    {text: '表单设计器(Form Designer)', link: '/guide/form_designer'},
                    {text: '流程设计器(Process Designer)', link: '/guide/process_designer'}
                ]
            },
            {
                text:'使用案例(examples)',
                items:[
                    {text: '休假申请', link: '/guide/examples'}
                ]
            },
            {
                text:'自定义扩展',
                items:[
                    {text: '自定义表单控件', link: '/guide/extension'}
                ]
            }
        ],
        search: {
            provider: 'local'
        },

        socialLinks: [
            {icon: 'github', link: 'https://github.com/vuejs/vitepress'}
        ]
    }
})
