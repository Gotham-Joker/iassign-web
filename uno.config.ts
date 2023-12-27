import {defineConfig, presetIcons, transformerDirectives, transformerVariantGroup} from 'unocss'
import presetUno from '@unocss/preset-uno'


/**
 * unocss设置。
 * 它帮忙解析html中你会用到的class名，然后动态生成uno.css文件，所谓on-demand，就是按需生成css。
 * 例如 class="pt-1" 即生成 .pt-1{padding-top: 0.25rem;}的代码
 *
 * 此外，还会解析scss文件中的unocss语法：
 * 例如使用flex-center这个class，使用@apply关键字组合了flex items-center justify-center三个unocss的class，
 * 就能生成你要的效果
 * .flex-center{
 *     @apply flex items-center justify-center
 * }
 * 会被替换成
 * .flex-center{
 *     display:flex;align-items:center;justify-content:center;
 * }
 */
export default defineConfig({
    presets: [
        presetUno(),
        presetIcons()
    ],
    theme: {
        'primary': ''
    },
    transformers: [
        transformerVariantGroup(),
        transformerDirectives()
    ],
    preflights: [],
    cli: {
        // CliEntryItem | CliEntryItem[]
        entry: [
            {
                patterns: ["src/**/*.html", "src/app/**/*.scss"],
                outFile: "src/uno.scss"
            }
        ]
    },
    // ...
})

interface CliEntryItem {
    /**
     * Glob patterns to match files
     */
    patterns: string[]
    /**
     * The output filename for the generated UnoCSS file
     */
    outFile: string
}