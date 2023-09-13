import {Component, forwardRef} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
    selector: 'app-shot-overlay',
    templateUrl: './shot-overlay.html',
    styleUrls: ['./shot-overlay.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ShotOverlay),
            multi: true
        }
    ]
})
export class ShotOverlay implements ControlValueAccessor {
    visible: boolean = false;
    onChangeCallback: (value: any) => void;
    onTouchedCallback: (value: any) => void;

    close() {
        this.visible = false;
        this.onChangeCallback(this.visible)
    }

    registerOnChange(fn: any): void {
        this.onChangeCallback = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouchedCallback = fn;
    }

    writeValue(obj: any): void {
        this.visible = obj;
    }
}
