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

import {
    Component,
    ElementRef, forwardRef, Input,
    OnInit,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import {
    Boot,
    createEditor,
    createToolbar,
    IDomEditor,
    IDropPanelMenu, SlateNode
} from "@wangeditor/editor";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {UploadService} from "../../upload.service";
import {COLORS, EMOTIONS} from "./constants";

Boot.registerMenu({
    key: 'bEmotion', factory() {
        return new BEmotion();
    }
})
const colors = Object.keys(COLORS);

@Component({
    selector: 'app-rich-text',
    templateUrl: './rich-text.html',
    styleUrls: ['./rich-text.scss', './colors.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => RichText),
            multi: true
        }
    ],
    standalone: true
})
export class RichText implements OnInit, ControlValueAccessor {
    onChangeCallback: (value: any) => void = (obj: any) => {
    };
    onTouchedCallback: (value: any) => void = (obj: any) => {
    };

    writeValue(obj: any): void {
        this.value = obj;
        if (this.editor != null) {
            if (obj != null && obj != "") {
                this.editor.setHtml(obj);
            } else {
                this.editor.setHtml('<p><br></p>');
            }
        }
    }

    registerOnChange(fn: any): void {
        this.onChangeCallback = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouchedCallback = fn;
    }

    setDisabledState?(isDisabled: boolean): void {
        this.disabled = isDisabled;
        if (this.disabled) {
            if (this.editor != null) {
                this.editor.disable();
            }
        } else {
            if (this.editor != null) {
                this.editor.enable();
            }
        }
    }

    disabled: boolean = false;
    @ViewChild('editorContainer', {read: ElementRef, static: true})
    editorContainer: ElementRef;
    @ViewChild('toolbarContainer', {read: ElementRef, static: true})
    toolbarContainer: ElementRef;

    value: any = '<p><br></p>';
    editor: IDomEditor;
    @Input() tool: boolean = true;


    constructor(private uploadSvc: UploadService) {
    }

    ngOnInit(): void {
        const that = this;
        const editorConfig = {
            placeholder: '请在此输入...',
            onChange(editor) {
                that.value = editor.getHtml();
                that.onChangeCallback(that.value);
            },
            MENU_CONF: {
                uploadImage: {
                    // 自定义上传
                    customUpload(file: File, insertFn: any) {  // TS 语法
                        // insertFn(url, alt, href)
                        that.uploadSvc.upload(file).subscribe(res => {
                            const url = res.data.url
                            insertFn(url, '', '');
                        })
                    }
                },
                color: {
                    // 文字配色和背景配色采用tailwind css配色 (黑白灰除外)
                    // 好处是直接使用生成的class
                    colors: colors
                },
                bgColor: {
                    colors: colors
                }
            },
            hoverbarKeys: {
                'image': {
                    // 表情包图片不许修改
                    match: (editor: IDomEditor, n: SlateNode) => {
                        return n['type'] == 'image' && n['href'] != 'emo-i';
                    },
                    menuKeys: ['imageWidth30', 'imageWidth50', 'imageWidth100', 'deleteImage']
                },
                'table': {
                    menuKeys: ["tableHeader", "tableFullWidth", "insertTableRow", "deleteTableRow", "insertTableCol", "deleteTableCol", "deleteTable"]
                }
            }
        }
        const editor = createEditor({
            selector: this.editorContainer.nativeElement,
            html: this.value,
            config: editorConfig,
            mode: 'simple', // or 'simple'
        });
        this.editor = editor;
        if (this.disabled) {
            this.editor.disable();
        }

        if (this.tool) {
            createToolbar({
                editor,
                selector: this.toolbarContainer.nativeElement,
                config: {
                    excludeKeys: ['header1', 'header2', 'header3', 'redo', 'undo',
                        'codeBlock', 'group-video', 'insertVideo', 'todo', 'through', 'clearStyle'],
                    insertKeys: {index: 0, keys: ['headerSelect', 'bEmotion']}
                },
                mode: 'simple', // or 'simple'
            });
        }
    }

    /**
     * 进一步处理富文本的值(润色)
     * @param value
     */
    static polish(value: string): string {
        if (value == null) {
            return "";
        }
        // 用正则表达式处理一下字体色和背景色
        // const polishEx = /style=.*?(background-)?color:\s*rgb\(.*?\);?.*?>/;
        let tmpValue = value;
        const polishEx = /style=.*?>/g;
        let match = polishEx.exec(value);
        while (match != null && match.length > 0 && match[0] != null) {
            const classNames: string[] = [];
            let str = match[0];
            let tmpStr = str;
            const bgEx = /background-color:\s*(rgb\(.*?\));?/
            const bgColorMatch = str.match(bgEx);
            // 将background-color颜色提取出来，转换称class，并删除style里的background-color
            if (bgColorMatch != null && bgColorMatch.length > 0) {
                const rgb = bgColorMatch[1].replaceAll(" ", "");
                const className = COLORS[rgb];
                if (className != null) {
                    classNames.push("bg-" + className);
                    tmpStr = tmpStr.replace(bgEx, "");
                }
            }
            // 同理，color也是类似的处理
            const ex = /color:\s*(rgb\(.*?\));?/;
            const colorMatch = str.match(ex);
            if (colorMatch != null && colorMatch.length > 0) {
                const rgb = colorMatch[1].replaceAll(" ", "");
                const className = COLORS[rgb];
                if (className != null) {
                    classNames.push("text-" + className);
                    tmpStr = tmpStr.replace(ex, "");
                }
            }
            if (classNames.length > 0) {
                tmpStr = tmpStr.replace("style=", "class=\"" + classNames.join(" ") + "\" style=")
                    .replace(/style="\s*"/, "");
                tmpValue = tmpValue.replace(str, tmpStr);
            }
            match = polishEx.exec(value); // 继续往下查找
        }
        return tmpValue;
    }

    /**
     * 此处的处理和后端保持一致
     * @param value
     */
    static polishAndProcess(value) {
        let val = RichText.polish(value);
        val = val.replaceAll(/style="text-align:\s*center;?"/g, "class=\"text-center\"")
            .replaceAll(/style="text-align:\s*left;?"/g, "class=\"text-start\"")
            .replaceAll(/style="text-align:\\s*right;?"/g, "class=\"text-end\"")
            .replaceAll(/alt="" data-href="emo-i" style=""/g, "class=\"emo-i\"");
        const exp = /<img src=.*?style="width: (\d+)%;">/
        let match = exp.exec(value);
        while (match != null && match.length > 1) {
            const img = match[0];
            const width = match[1];
            const imgNew = img.replaceAll(/style="width: \d+%;"/g, "class=\"w-" + width + "p\"");
            val = val.replace(img, imgNew);
        }
        return val;
    }
}

class BEmotion implements IDropPanelMenu {
    exec(editor: IDomEditor, value: string | boolean): void {
    }

    getPanelContentElem(editor: IDomEditor) {
        if (this.dom == null) {
            const ul = document.createElement("ul");
            ul.style.width = '272px';
            ul.style.textAlign = 'left';
            EMOTIONS.forEach(e => {
                const li = document.createElement("li");
                li.setAttribute("class", "emotion");
                li.onclick = (ev) => {
                    const node = {type: 'image', src: `/assets/emotions/${e}`, href: 'emo-i', children: [{text: ''}]}
                    editor.insertNode(node);
                    editor.hidePanelOrModal();
                };
                const img = document.createElement("img");
                img.src = '/assets/emotions/' + e;
                li.appendChild(img)
                ul.appendChild(li);
            })
            this.dom = ul;
        }
        return this.dom;
    }

    getValue(editor: IDomEditor): string | boolean {
        return '';
    }

    isActive(editor: IDomEditor): boolean {
        return false;
    }

    isDisabled(editor: IDomEditor): boolean {
        return false;
    }

    readonly showDropPanel: boolean;
    readonly tag: string;
    readonly title: string;
    readonly iconSvg: string;
    dom: Element;

    constructor() {
        this.title = '表情';
        this.tag = 'button';
        this.iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><path d="M512 1024C230.4 1024 0 793.6 0 512S230.4 0 512 0s512 230.4 512 512-230.4 512-512 512z m0-102.4c226.742857 0 409.6-182.857143 409.6-409.6S738.742857 102.4 512 102.4 102.4 285.257143 102.4 512s182.857143 409.6 409.6 409.6z m-204.8-358.4h409.6c0 113.371429-91.428571 204.8-204.8 204.8s-204.8-91.428571-204.8-204.8z m0-102.4c-43.885714 0-76.8-32.914286-76.8-76.8s32.914286-76.8 76.8-76.8 76.8 32.914286 76.8 76.8-32.914286 76.8-76.8 76.8z m409.6 0c-43.885714 0-76.8-32.914286-76.8-76.8s32.914286-76.8 76.8-76.8c43.885714 0 76.8 32.914286 76.8 76.8s-32.914286 76.8-76.8 76.8z"></path></svg>'
        this.showDropPanel = true;
    }

}