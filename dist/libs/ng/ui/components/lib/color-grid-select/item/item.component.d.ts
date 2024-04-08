import Color from 'color';
import { ElementRef, InjectionToken } from '@angular/core';
import { FocusableOption, Highlightable } from '@angular/cdk/a11y';
import * as i0 from "@angular/core";
export declare const COLOR_GRID_ITEMS: string[];
export declare const COLOR_GRID_ITEM_SIZES: readonly ["small", "medium", "large"];
export declare const getContrastColor: (color: Color | string) => "rgb(255,255,255)" | "rgb(0,0,0)";
export type ColorGridItemSize = (typeof COLOR_GRID_ITEM_SIZES)[number];
export type ColorGridSelect = {
    value?: string | null;
    emitChange: (value?: string | null) => void;
};
/**
 * Injection token that can be used to inject instances of `ColorGridSelectComponent`. It serves as
 * alternative token to the actual `ColorGridSelectComponent` class which could cause unnecessary
 * retention of the class and its component metadata.
 */
export declare const COLOR_GRID_SELECT: InjectionToken<ColorGridSelect>;
export declare class ColorGridItemComponent implements Highlightable, FocusableOption {
    private _uniqueId;
    /** Whether this item is disabled. */
    private _disabled;
    private _value?;
    private readonly _colorGridSelect;
    private readonly _changeDetector;
    private get _role();
    /** The unique ID for the radio button. */
    id: string;
    /** Analog to HTML 'name' attribute used to group radios for unique selection. */
    name: string;
    get value(): string | undefined;
    set value(value: string | undefined);
    size: ColorGridItemSize;
    checked: boolean;
    /** Whether the radio button is disabled. */
    get disabled(): boolean;
    set disabled(value: boolean);
    /** ID of the native input element inside `<brew-color-grid-item>` */
    get inputId(): string;
    readonly elRef: ElementRef<any>;
    colorContrast?: string;
    active: boolean;
    setActiveStyles(): void;
    setInactiveStyles(): void;
    focus(): void;
    /** Sets the tabindex of the list option. */
    setTabindex(value: number): void;
    /** Sets the disabled state and marks for check if a change occurred. */
    protected _setDisabled(value: boolean): void;
    private _toggleOnInteraction;
    static ɵfac: i0.ɵɵFactoryDeclaration<ColorGridItemComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ColorGridItemComponent, "brew-color-grid-item", never, { "id": { "alias": "id"; "required": false; }; "name": { "alias": "name"; "required": false; }; "value": { "alias": "value"; "required": false; }; "size": { "alias": "size"; "required": false; }; "checked": { "alias": "checked"; "required": false; }; "disabled": { "alias": "disabled"; "required": false; }; }, {}, never, never, true, never>;
    static ngAcceptInputType_checked: unknown;
    static ngAcceptInputType_disabled: unknown;
}
