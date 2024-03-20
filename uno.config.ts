/*
 * MIT License
 *
 * Copyright (c) 2024 Hongtao Liu
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

import {defineConfig, presetIcons, transformerDirectives, transformerVariantGroup} from 'unocss'
import presetUno from '@unocss/preset-uno'


/**
 * unocss设置。
 * 它帮忙解析html中你会用到的class名，然后动态生成uno.css文件内容，所谓on-demand，就是按需生成css。
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