import {defineConfig, presetUno, transformerDirectives, transformerVariantGroup} from "unocss";

/**
 * unocss开发环境配置，unocss能够按需生成css代码。
 * 例如在html中写class="pt-1"，就会在src/uno.scss文件中生成.pt-1{padding-top:0.25rem;}的代码。
 * 其他高级使用方式请查看官网。
 * 在angular中，暂时每次都需要在终端中运行unocss重新编译生成uno.scss文件。
 */
export default defineConfig({
    presets: [
        presetUno()
    ],
    transformers:[
        transformerDirectives(),
        transformerVariantGroup()
    ],
    preflights:[],
    cli:{
        entry:[
            {
                patterns:["src/**/*.html","src/app/**/*.scss"],
                outFile:"src/uno.scss"
            }
        ]
    }
})