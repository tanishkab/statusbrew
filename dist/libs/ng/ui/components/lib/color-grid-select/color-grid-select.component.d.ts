import { AfterViewInit, EventEmitter, OnDestroy, QueryList } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { ColorGridItemSize, ColorGridItemComponent, ColorGridSelect } from './item';
import { FocusKeyManager } from '@angular/cdk/a11y';
import * as i0 from "@angular/core";
/**
 *
 * A lot of the code has been inspired by
 * [MatSelectionList](https://github.com/angular/components/blob/main/src/material/list/selection-list.ts)
 * for focus management and accessibility.
 *
 * @todo
 * - Handle {@link ColorGridSelectComponent._onKeydown}
 * - Calculate {@link ColorGridSelectComponent.grid}
 *
 * @link https://blog.angular-university.io/angular-custom-form-controls/
 */
export declare class ColorGridSelectComponent implements ControlValueAccessor, ColorGridSelect, AfterViewInit, OnDestroy {
    /** Emits when the list has been destroyed. */
    private readonly _destroyed;
    private readonly _items;
    private readonly _itemSize;
    private readonly _el;
    private readonly _ngZone;
    private _itemsPerRow;
    private _keyManager;
    private _value?;
    private _disabled;
    private _touched;
    private _onTouched;
    private _onChange;
    private get _tabIndex();
    private get _role();
    colorItems: QueryList<ColorGridItemComponent>;
    set items(value: string[]);
    get items(): string[];
    get itemSize(): ColorGridItemSize;
    set itemSize(value: ColorGridItemSize);
    get value(): string | null | undefined;
    set value(value: string | null | undefined);
    disabled: boolean;
    readonly valueChange: EventEmitter<string | null | undefined>;
    /** @todo logic to generate a grid of colors to allow navigation */
    readonly grid: import("@angular/core").Signal<string[][]>;
    get keyMan(): FocusKeyManager<ColorGridItemComponent>;
    writeValue(val: string): void;
    registerOnChange(onChange: (val?: string | null) => void): void;
    registerOnTouched(fn: () => void): void;
    setDisabledState(isDisabled: boolean): void;
    /** Marks the component as touched */
    markAsTouched(): void;
    emitChange(value?: string | null | undefined): void;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    /**
     * @todo
     * The logic to decide how to navigate inside the grid when the
     * up, down, left and right buttons are pressed
     */
    private _onKeydown;
    sanitizeIndex(nextIndex: number, prevIndex: number): number;
    /** Handles focusout events within the list. */
    private _handleFocusout;
    /** Handles focusin events within the list. */
    private _handleFocusin;
    /**
     * Sets an option as active.
     * @param index Index of the active option. If set to -1, no option will be active.
     */
    private _setActiveOption;
    /**
     * Resets the active option. When the list is disabled, remove all options from to the tab order.
     * Otherwise, focus the first selected option.
     */
    private _resetActiveOption;
    /** Returns whether the focus is currently within the list. */
    private _containsFocus;
    private _updateKeyManagerActiveItem;
    static ɵfac: i0.ɵɵFactoryDeclaration<ColorGridSelectComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ColorGridSelectComponent, "brew-color-grid-select", never, { "items": { "alias": "items"; "required": false; }; "itemSize": { "alias": "itemSize"; "required": false; }; "value": { "alias": "value"; "required": false; }; "disabled": { "alias": "disabled"; "required": false; }; }, { "valueChange": "valueChange"; }, never, never, true, never>;
}
