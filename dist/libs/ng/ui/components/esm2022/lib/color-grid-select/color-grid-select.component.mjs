import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, HostBinding, HostListener, Input, NgZone, Output, QueryList, ViewChildren, computed, inject, signal, } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { COLOR_GRID_ITEMS, COLOR_GRID_ITEM_SIZES, ColorGridItemComponent, COLOR_GRID_SELECT, } from './item';
import { FocusKeyManager } from '@angular/cdk/a11y';
import { DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW, UP_ARROW, } from '@angular/cdk/keycodes';
import { chunk } from 'lodash';
import { _getFocusedElementPierceShadowDom } from '@angular/cdk/platform';
import { Subject, takeUntil } from 'rxjs';
import * as i0 from "@angular/core";
function ColorGridSelectComponent_For_3_For_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "brew-color-grid-item", 2);
} if (rf & 2) {
    const item_r7 = ctx.$implicit;
    const ctx_r6 = i0.ɵɵnextContext(2);
    i0.ɵɵproperty("checked", ctx_r6.value === item_r7)("value", item_r7)("size", ctx_r6.itemSize)("disabled", ctx_r6.disabled);
    i0.ɵɵattribute("aria-selected", ctx_r6.value === item_r7 ? "true" : "false")("aria-disabled", ctx_r6.disabled ? "true" : "false")("aria-label", ctx_r6.value);
} }
function ColorGridSelectComponent_For_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 1);
    i0.ɵɵrepeaterCreate(1, ColorGridSelectComponent_For_3_For_2_Template, 1, 7, "brew-color-grid-item", 2, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const row_r1 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵrepeater(row_r1);
} }
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
export class ColorGridSelectComponent {
    constructor() {
        /** Emits when the list has been destroyed. */
        this._destroyed = new Subject();
        this._items = signal(COLOR_GRID_ITEMS);
        this._itemSize = signal(COLOR_GRID_ITEM_SIZES[2]);
        this._el = inject((ElementRef));
        this._ngZone = inject(NgZone);
        this._itemsPerRow = 5;
        this._value = COLOR_GRID_ITEMS[0];
        this._disabled = false;
        this._touched = false;
        this._onTouched = () => void 0;
        this._onChange = (val) => void 0;
        this.disabled = false;
        this.valueChange = new EventEmitter();
        /** @todo logic to generate a grid of colors to allow navigation */
        this.grid = computed(() => {
            // Calculate the number of items that can be added per row
            // The calculation will be based on the available width of the element width and itemSize
            const width = document.getElementById('color-grid')?.clientWidth;
            if (width) {
                const itemSize = this.itemSize == 'small' ? 32 : this.itemSize == 'medium' ? 64 : 100;
                this._itemsPerRow = width / itemSize;
            }
            else {
                this._itemsPerRow = 5;
            }
            //
            return chunk(this._items(), this._itemsPerRow);
        });
        /** Handles focusout events within the list. */
        this._handleFocusout = () => {
            // Focus takes a while to update so we have to wrap our call in a timeout.
            setTimeout(() => {
                if (!this._containsFocus()) {
                    this._resetActiveOption();
                }
            });
        };
        /** Handles focusin events within the list. */
        this._handleFocusin = (event) => {
            if (this.disabled) {
                return;
            }
            const activeIndex = this.colorItems
                .toArray()
                .findIndex((item) => item.elRef.nativeElement.contains(event.target));
            if (activeIndex > -1) {
                this._setActiveOption(activeIndex);
            }
            else {
                this._resetActiveOption();
            }
        };
    }
    get _tabIndex() {
        return -1;
        // return this.disabled ? -1 : 0;
    }
    get _role() {
        return 'radiogroup';
    }
    set items(value) {
        this._items.set(value);
    }
    get items() {
        return this._items();
    }
    get itemSize() {
        return this._itemSize();
    }
    set itemSize(value) {
        this._itemSize.set(value);
    }
    get value() {
        return this._value;
    }
    set value(value) {
        this._value = value;
        if (this.colorItems) {
            this._updateKeyManagerActiveItem();
        }
    }
    get keyMan() {
        return this._keyManager;
    }
    // ControlValueAccessor
    writeValue(val) {
        this.value = val;
        const isPresent = this.items.find(c => c == val);
        if (!isPresent) {
            this.items = [...this.items, val];
        }
        this.grid();
    }
    registerOnChange(onChange) {
        this._onChange = onChange;
    }
    registerOnTouched(fn) {
        this._onTouched = fn;
    }
    setDisabledState(isDisabled) {
        this._disabled = isDisabled;
    }
    // /ControlValueAccessor
    /** Marks the component as touched */
    markAsTouched() {
        if (!this._touched) {
            this._onTouched();
            this._touched = true;
        }
    }
    emitChange(value) {
        this.markAsTouched();
        if (!this._disabled) {
            this.value = value;
            this._onChange(this.value);
            this.valueChange.emit(value);
        }
    }
    ngAfterViewInit() {
        this._keyManager = new FocusKeyManager(this.colorItems)
            .withHomeAndEnd()
            .withHorizontalOrientation('ltr')
            .skipPredicate(() => this.disabled)
            .withWrap();
        // Set the initial focus.
        this._resetActiveOption();
        // Move the tabindex to the currently-focused list item.
        // this._keyManager.change.subscribe((activeItemIndex) => {
        // this._setActiveOption(activeItemIndex);
        // });
        // If the active item is removed from the list, reset back to the first one.
        this.colorItems.changes.pipe(takeUntil(this._destroyed)).subscribe(() => {
            const activeItem = this._keyManager.activeItem;
            if (!activeItem || this.colorItems.toArray().indexOf(activeItem) === -1) {
                this._resetActiveOption();
            }
        });
        // These events are bound outside the zone, because they don't change
        // any change-detected properties and they can trigger timeouts.
        this._ngZone.runOutsideAngular(() => {
            this._el.nativeElement.addEventListener('focusin', this._handleFocusin);
            this._el.nativeElement.addEventListener('focusout', this._handleFocusout);
        });
    }
    ngOnDestroy() {
        this._keyManager.destroy();
        this._el.nativeElement.removeEventListener('focusin', this._handleFocusin);
        this._el.nativeElement.removeEventListener('focusout', this._handleFocusout);
        this._destroyed.next();
        this._destroyed.complete();
    }
    /**
     * @todo
     * The logic to decide how to navigate inside the grid when the
     * up, down, left and right buttons are pressed
     */
    _onKeydown(event) {
        const index = this._keyManager.activeItemIndex;
        let nextIndex = index || 0;
        if (index) {
            switch (event.keyCode) {
                case UP_ARROW:
                    nextIndex = index - Math.floor(this._itemsPerRow);
                    nextIndex = this.sanitizeIndex(nextIndex, index);
                    this._keyManager.setActiveItem(nextIndex);
                    break;
                case DOWN_ARROW:
                    nextIndex = index + Math.floor(this._itemsPerRow);
                    nextIndex = this.sanitizeIndex(nextIndex, index);
                    this._keyManager.setActiveItem(nextIndex);
                    break;
                case LEFT_ARROW:
                case RIGHT_ARROW:
                    this._keyManager.onKeydown(event);
                    break;
            }
        }
    }
    sanitizeIndex(nextIndex, prevIndex) {
        nextIndex = nextIndex < 0 ? prevIndex : nextIndex;
        nextIndex = nextIndex >= this.items.length ? prevIndex : nextIndex;
        return nextIndex;
    }
    /**
     * Sets an option as active.
     * @param index Index of the active option. If set to -1, no option will be active.
     */
    _setActiveOption(index) {
        this.colorItems.forEach((item, itemIndex) => item.setTabindex(itemIndex === index ? 0 : -1));
        this._keyManager.updateActiveItem(index);
    }
    /**
     * Resets the active option. When the list is disabled, remove all options from to the tab order.
     * Otherwise, focus the first selected option.
     */
    _resetActiveOption() {
        if (this.disabled) {
            this._setActiveOption(-1);
            return;
        }
        const activeItem = this.colorItems.find((item) => item.checked && !item.disabled) ||
            this.colorItems.first;
        const index = activeItem
            ? this.colorItems.toArray().indexOf(activeItem)
            : -1;
        this._setActiveOption(index);
    }
    /** Returns whether the focus is currently within the list. */
    _containsFocus() {
        const activeElement = _getFocusedElementPierceShadowDom();
        return activeElement && this._el.nativeElement.contains(activeElement);
    }
    _updateKeyManagerActiveItem() {
        const index = this.items.findIndex((item) => item == this.value);
        this._setActiveOption(index);
    }
    static { this.ɵfac = function ColorGridSelectComponent_Factory(t) { return new (t || ColorGridSelectComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: ColorGridSelectComponent, selectors: [["brew-color-grid-select"]], viewQuery: function ColorGridSelectComponent_Query(rf, ctx) { if (rf & 1) {
            i0.ɵɵviewQuery(ColorGridItemComponent, 5);
        } if (rf & 2) {
            let _t;
            i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.colorItems = _t);
        } }, hostVars: 2, hostBindings: function ColorGridSelectComponent_HostBindings(rf, ctx) { if (rf & 1) {
            i0.ɵɵlistener("keydown", function ColorGridSelectComponent_keydown_HostBindingHandler($event) { return ctx._onKeydown($event); });
        } if (rf & 2) {
            i0.ɵɵhostProperty("role", ctx._role);
            i0.ɵɵattribute("tabindex", ctx._tabIndex);
        } }, inputs: { items: "items", itemSize: "itemSize", value: "value", disabled: "disabled" }, outputs: { valueChange: "valueChange" }, standalone: true, features: [i0.ɵɵProvidersFeature([
                {
                    provide: NG_VALUE_ACCESSOR,
                    multi: true,
                    useExisting: ColorGridSelectComponent,
                },
                {
                    provide: COLOR_GRID_SELECT,
                    useExisting: ColorGridSelectComponent,
                },
            ]), i0.ɵɵStandaloneFeature], decls: 4, vars: 0, consts: [["role", "dialog"], ["id", "color-grid", 1, "flex"], ["role", "option", 3, "checked", "value", "size", "disabled"], ["id", "color-grid", "class", "flex"]], template: function ColorGridSelectComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 0);
            i0.ɵɵtext(1, "Color options:");
            i0.ɵɵelementEnd();
            i0.ɵɵrepeaterCreate(2, ColorGridSelectComponent_For_3_Template, 3, 0, "div", 3, i0.ɵɵrepeaterTrackByIndex);
        } if (rf & 2) {
            i0.ɵɵadvance(2);
            i0.ɵɵrepeater(ctx.grid());
        } }, dependencies: [CommonModule, ColorGridItemComponent], styles: ["#color-grid[_ngcontent-%COMP%]{max-width:70vw;margin:auto}"], changeDetection: 0 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(ColorGridSelectComponent, [{
        type: Component,
        args: [{ selector: 'brew-color-grid-select', standalone: true, imports: [CommonModule, ColorGridItemComponent], changeDetection: ChangeDetectionStrategy.OnPush, providers: [
                    {
                        provide: NG_VALUE_ACCESSOR,
                        multi: true,
                        useExisting: ColorGridSelectComponent,
                    },
                    {
                        provide: COLOR_GRID_SELECT,
                        useExisting: ColorGridSelectComponent,
                    },
                ], template: "<div role=\"dialog\">Color options:</div>\n@for(row of grid(); track $index) {\n<div id=\"color-grid\" class=\"flex\">\n  @for (item of row; track item) {\n  <brew-color-grid-item\n    role=\"option\"\n    [attr.aria-selected]=\"value === item ? 'true' : 'false'\"\n    [attr.aria-disabled]=\"disabled ? 'true' : 'false'\"\n    [attr.aria-label] = \"value\"\n    [checked]=\"value === item\"\n    [value]=\"item\"\n    [size]=\"itemSize\"\n    [disabled]=\"disabled\"\n  />\n  }\n</div>\n}\n", styles: ["#color-grid{max-width:70vw;margin:auto}\n"] }]
    }], null, { _tabIndex: [{
            type: HostBinding,
            args: ['attr.tabindex']
        }], _role: [{
            type: HostBinding,
            args: ['role']
        }], colorItems: [{
            type: ViewChildren,
            args: [ColorGridItemComponent]
        }], items: [{
            type: Input
        }], itemSize: [{
            type: Input
        }], value: [{
            type: Input
        }], disabled: [{
            type: Input
        }], valueChange: [{
            type: Output
        }], _onKeydown: [{
            type: HostListener,
            args: ['keydown', ['$event']]
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(ColorGridSelectComponent, { className: "ColorGridSelectComponent", filePath: "lib\\color-grid-select\\color-grid-select.component.ts", lineNumber: 71 }); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sb3ItZ3JpZC1zZWxlY3QuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vbGlicy9uZy91aS9jb21wb25lbnRzL3NyYy9saWIvY29sb3ItZ3JpZC1zZWxlY3QvY29sb3ItZ3JpZC1zZWxlY3QuY29tcG9uZW50LnRzIiwiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vbGlicy9uZy91aS9jb21wb25lbnRzL3NyYy9saWIvY29sb3ItZ3JpZC1zZWxlY3QvY29sb3ItZ3JpZC1zZWxlY3QuY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUVMLHVCQUF1QixFQUN2QixTQUFTLEVBQ1QsVUFBVSxFQUNWLFlBQVksRUFDWixXQUFXLEVBQ1gsWUFBWSxFQUNaLEtBQUssRUFDTCxNQUFNLEVBRU4sTUFBTSxFQUNOLFNBQVMsRUFDVCxZQUFZLEVBQ1osUUFBUSxFQUNSLE1BQU0sRUFDTixNQUFNLEdBQ1AsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBd0IsaUJBQWlCLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUN6RSxPQUFPLEVBQ0wsZ0JBQWdCLEVBQ2hCLHFCQUFxQixFQUVyQixzQkFBc0IsRUFFdEIsaUJBQWlCLEdBQ2xCLE1BQU0sUUFBUSxDQUFDO0FBQ2hCLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUNwRCxPQUFPLEVBQ0wsVUFBVSxFQUNWLFVBQVUsRUFDVixXQUFXLEVBQ1gsUUFBUSxHQUNULE1BQU0sdUJBQXVCLENBQUM7QUFDL0IsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLFFBQVEsQ0FBQztBQUMvQixPQUFPLEVBQUUsaUNBQWlDLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUMxRSxPQUFPLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxN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Q3BDO29CQUNUO3dCQUNFLE9BQU8sRUFBRSxpQkFBaUI7d0JBQzFCLEtBQUssRUFBRSxJQUFJO3dCQUNYLFdBQVcsMEJBQTBCO3FCQUN0QztvQkFDRDt3QkFDRSxPQUFPLEVBQUUsaUJBQWlCO3dCQUMxQixXQUFXLDBCQUEwQjtxQkFDdEM7aUJBQ0Y7Z0JBOEJXLFNBQVM7a0JBRHBCLFdBQVc7bUJBQUMsZUFBZTtZQU9oQixLQUFLO2tCQURoQixXQUFXO21CQUFDLE1BQU07WUFNWixVQUFVO2tCQURoQixZQUFZO21CQUFDLHNCQUFzQjtZQUl6QixLQUFLO2tCQURmLEtBQUs7WUFVSyxRQUFRO2tCQURsQixLQUFLO1lBVUssS0FBSztrQkFEZixLQUFLO1lBYUMsUUFBUTtrQkFEZCxLQUFLO1lBSVUsV0FBVztrQkFEMUIsTUFBTTtZQW9IQyxVQUFVO2tCQURqQixZQUFZO21CQUFDLFNBQVMsRUFBRSxDQUFDLFFBQVEsQ0FBQzs7a0ZBN0x4Qix3QkFBd0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBBZnRlclZpZXdJbml0LFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ29tcG9uZW50LFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIEhvc3RCaW5kaW5nLFxuICBIb3N0TGlzdGVuZXIsXG4gIElucHV0LFxuICBOZ1pvbmUsXG4gIE9uRGVzdHJveSxcbiAgT3V0cHV0LFxuICBRdWVyeUxpc3QsXG4gIFZpZXdDaGlsZHJlbixcbiAgY29tcHV0ZWQsXG4gIGluamVjdCxcbiAgc2lnbmFsLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBDb250cm9sVmFsdWVBY2Nlc3NvciwgTkdfVkFMVUVfQUNDRVNTT1IgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQge1xuICBDT0xPUl9HUklEX0lURU1TLFxuICBDT0xPUl9HUklEX0lURU1fU0laRVMsXG4gIENvbG9yR3JpZEl0ZW1TaXplLFxuICBDb2xvckdyaWRJdGVtQ29tcG9uZW50LFxuICBDb2xvckdyaWRTZWxlY3QsXG4gIENPTE9SX0dSSURfU0VMRUNULFxufSBmcm9tICcuL2l0ZW0nO1xuaW1wb3J0IHsgRm9jdXNLZXlNYW5hZ2VyIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2ExMXknO1xuaW1wb3J0IHtcbiAgRE9XTl9BUlJPVyxcbiAgTEVGVF9BUlJPVyxcbiAgUklHSFRfQVJST1csXG4gIFVQX0FSUk9XLFxufSBmcm9tICdAYW5ndWxhci9jZGsva2V5Y29kZXMnO1xuaW1wb3J0IHsgY2h1bmsgfSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHsgX2dldEZvY3VzZWRFbGVtZW50UGllcmNlU2hhZG93RG9tIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BsYXRmb3JtJztcbmltcG9ydCB7IFN1YmplY3QsIHRha2VVbnRpbCB9IGZyb20gJ3J4anMnO1xuXG4vKipcbiAqXG4gKiBBIGxvdCBvZiB0aGUgY29kZSBoYXMgYmVlbiBpbnNwaXJlZCBieVxuICogW01hdFNlbGVjdGlvbkxpc3RdKGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvYmxvYi9tYWluL3NyYy9tYXRlcmlhbC9saXN0L3NlbGVjdGlvbi1saXN0LnRzKVxuICogZm9yIGZvY3VzIG1hbmFnZW1lbnQgYW5kIGFjY2Vzc2liaWxpdHkuXG4gKlxuICogQHRvZG9cbiAqIC0gSGFuZGxlIHtAbGluayBDb2xvckdyaWRTZWxlY3RDb21wb25lbnQuX29uS2V5ZG93bn1cbiAqIC0gQ2FsY3VsYXRlIHtAbGluayBDb2xvckdyaWRTZWxlY3RDb21wb25lbnQuZ3JpZH1cbiAqXG4gKiBAbGluayBodHRwczovL2Jsb2cuYW5ndWxhci11bml2ZXJzaXR5LmlvL2FuZ3VsYXItY3VzdG9tLWZvcm0tY29udHJvbHMvXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2JyZXctY29sb3ItZ3JpZC1zZWxlY3QnLFxuICBzdGFuZGFsb25lOiB0cnVlLFxuICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlLCBDb2xvckdyaWRJdGVtQ29tcG9uZW50XSxcbiAgdGVtcGxhdGVVcmw6ICcuL2NvbG9yLWdyaWQtc2VsZWN0LmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmw6ICcuL2NvbG9yLWdyaWQtc2VsZWN0LmNvbXBvbmVudC5zY3NzJyxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIHByb3ZpZGVyczogW1xuICAgIHtcbiAgICAgIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxuICAgICAgbXVsdGk6IHRydWUsXG4gICAgICB1c2VFeGlzdGluZzogQ29sb3JHcmlkU2VsZWN0Q29tcG9uZW50LFxuICAgIH0sXG4gICAge1xuICAgICAgcHJvdmlkZTogQ09MT1JfR1JJRF9TRUxFQ1QsXG4gICAgICB1c2VFeGlzdGluZzogQ29sb3JHcmlkU2VsZWN0Q29tcG9uZW50LFxuICAgIH0sXG4gIF0sXG59KVxuZXhwb3J0IGNsYXNzIENvbG9yR3JpZFNlbGVjdENvbXBvbmVudFxuICBpbXBsZW1lbnRzIENvbnRyb2xWYWx1ZUFjY2Vzc29yLCBDb2xvckdyaWRTZWxlY3QsIEFmdGVyVmlld0luaXQsIE9uRGVzdHJveVxue1xuICAvKiogRW1pdHMgd2hlbiB0aGUgbGlzdCBoYXMgYmVlbiBkZXN0cm95ZWQuICovXG4gIHByaXZhdGUgcmVhZG9ubHkgX2Rlc3Ryb3llZCA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgcHJpdmF0ZSByZWFkb25seSBfaXRlbXMgPSBzaWduYWwoQ09MT1JfR1JJRF9JVEVNUyk7XG4gIHByaXZhdGUgcmVhZG9ubHkgX2l0ZW1TaXplID0gc2lnbmFsPENvbG9yR3JpZEl0ZW1TaXplPihcbiAgICBDT0xPUl9HUklEX0lURU1fU0laRVNbMl1cbiAgKTtcblxuICBwcml2YXRlIHJlYWRvbmx5IF9lbCA9IGluamVjdChFbGVtZW50UmVmPENvbG9yR3JpZFNlbGVjdENvbXBvbmVudD4pO1xuXG4gIHByaXZhdGUgcmVhZG9ubHkgX25nWm9uZSA9IGluamVjdChOZ1pvbmUpO1xuXG4gIHByaXZhdGUgX2l0ZW1zUGVyUm93ID0gNTtcblxuICBwcml2YXRlIF9rZXlNYW5hZ2VyITogRm9jdXNLZXlNYW5hZ2VyPENvbG9yR3JpZEl0ZW1Db21wb25lbnQ+O1xuXG4gIHByaXZhdGUgX3ZhbHVlPzogc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZCA9IENPTE9SX0dSSURfSVRFTVNbMF07XG5cbiAgcHJpdmF0ZSBfZGlzYWJsZWQgPSBmYWxzZTtcbiAgcHJpdmF0ZSBfdG91Y2hlZCA9IGZhbHNlO1xuXG4gIHByaXZhdGUgX29uVG91Y2hlZCA9ICgpOiB2b2lkID0+IHZvaWQgMDtcbiAgcHJpdmF0ZSBfb25DaGFuZ2UgPSAodmFsPzogc3RyaW5nIHwgbnVsbCk6IHZvaWQgPT4gdm9pZCAwO1xuXG4gIEBIb3N0QmluZGluZygnYXR0ci50YWJpbmRleCcpXG4gIHByaXZhdGUgZ2V0IF90YWJJbmRleCgpIHtcbiAgICByZXR1cm4gLTE7XG4gICAgLy8gcmV0dXJuIHRoaXMuZGlzYWJsZWQgPyAtMSA6IDA7XG4gIH1cblxuICBASG9zdEJpbmRpbmcoJ3JvbGUnKVxuICBwcml2YXRlIGdldCBfcm9sZSgpIHtcbiAgICByZXR1cm4gJ3JhZGlvZ3JvdXAnO1xuICB9XG5cbiAgQFZpZXdDaGlsZHJlbihDb2xvckdyaWRJdGVtQ29tcG9uZW50KVxuICBwdWJsaWMgY29sb3JJdGVtcyE6IFF1ZXJ5TGlzdDxDb2xvckdyaWRJdGVtQ29tcG9uZW50PjtcblxuICBASW5wdXQoKVxuICBwdWJsaWMgc2V0IGl0ZW1zKHZhbHVlKSB7XG4gICAgdGhpcy5faXRlbXMuc2V0KHZhbHVlKTtcbiAgfVxuXG4gIHB1YmxpYyBnZXQgaXRlbXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2l0ZW1zKCk7XG4gIH1cblxuICBASW5wdXQoKVxuICBwdWJsaWMgZ2V0IGl0ZW1TaXplKCk6IENvbG9yR3JpZEl0ZW1TaXplIHtcbiAgICByZXR1cm4gdGhpcy5faXRlbVNpemUoKTtcbiAgfVxuXG4gIHB1YmxpYyBzZXQgaXRlbVNpemUodmFsdWU6IENvbG9yR3JpZEl0ZW1TaXplKSB7XG4gICAgdGhpcy5faXRlbVNpemUuc2V0KHZhbHVlKTtcbiAgfVxuXG4gIEBJbnB1dCgpXG4gIHB1YmxpYyBnZXQgdmFsdWUoKTogc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZCB7XG4gICAgcmV0dXJuIHRoaXMuX3ZhbHVlO1xuICB9XG5cbiAgcHVibGljIHNldCB2YWx1ZSh2YWx1ZTogc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZCkge1xuICAgIHRoaXMuX3ZhbHVlID0gdmFsdWU7XG4gICAgaWYgKHRoaXMuY29sb3JJdGVtcyl7XG4gICAgICB0aGlzLl91cGRhdGVLZXlNYW5hZ2VyQWN0aXZlSXRlbSgpXG4gICAgfVxuICB9XG5cbiAgQElucHV0KClcbiAgcHVibGljIGRpc2FibGVkID0gZmFsc2U7XG5cbiAgQE91dHB1dCgpXG4gIHB1YmxpYyByZWFkb25seSB2YWx1ZUNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8c3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZD4oKTtcblxuICAvKiogQHRvZG8gbG9naWMgdG8gZ2VuZXJhdGUgYSBncmlkIG9mIGNvbG9ycyB0byBhbGxvdyBuYXZpZ2F0aW9uICovXG4gIHB1YmxpYyByZWFkb25seSBncmlkID0gY29tcHV0ZWQoKCk6IHN0cmluZ1tdW10gPT4ge1xuICAgIC8vIENhbGN1bGF0ZSB0aGUgbnVtYmVyIG9mIGl0ZW1zIHRoYXQgY2FuIGJlIGFkZGVkIHBlciByb3dcbiAgICAvLyBUaGUgY2FsY3VsYXRpb24gd2lsbCBiZSBiYXNlZCBvbiB0aGUgYXZhaWxhYmxlIHdpZHRoIG9mIHRoZSBlbGVtZW50IHdpZHRoIGFuZCBpdGVtU2l6ZVxuICAgICAgY29uc3Qgd2lkdGggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29sb3ItZ3JpZCcpPy5jbGllbnRXaWR0aDtcbiAgICAgIGlmICh3aWR0aCkge1xuICAgICAgICBjb25zdCBpdGVtU2l6ZSA9IHRoaXMuaXRlbVNpemUgPT0gJ3NtYWxsJyA/IDMyIDogdGhpcy5pdGVtU2l6ZSA9PSAnbWVkaXVtJyA/IDY0IDogMTAwO1xuICAgICAgICB0aGlzLl9pdGVtc1BlclJvdyA9IHdpZHRoIC8gaXRlbVNpemVcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX2l0ZW1zUGVyUm93ID0gNVxuICAgICAgfVxuICAgIC8vXG5cbiAgICByZXR1cm4gY2h1bmsodGhpcy5faXRlbXMoKSwgdGhpcy5faXRlbXNQZXJSb3cpO1xuICB9KTtcblxuICBwdWJsaWMgZ2V0IGtleU1hbigpIHtcbiAgICByZXR1cm4gdGhpcy5fa2V5TWFuYWdlcjtcbiAgfVxuXG4gIC8vIENvbnRyb2xWYWx1ZUFjY2Vzc29yXG4gIHB1YmxpYyB3cml0ZVZhbHVlKHZhbDogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhpcy52YWx1ZSA9IHZhbDtcbiAgICBcbiAgICBjb25zdCBpc1ByZXNlbnQgPSB0aGlzLml0ZW1zLmZpbmQoYyA9PiBjID09IHZhbClcbiAgICBpZiAoIWlzUHJlc2VudCkge1xuICAgICAgdGhpcy5pdGVtcyA9IFsuLi50aGlzLml0ZW1zLCB2YWxdO1xuICAgIH1cbiAgICB0aGlzLmdyaWQoKVxuICAgXG4gIH1cblxuICBwdWJsaWMgcmVnaXN0ZXJPbkNoYW5nZShvbkNoYW5nZTogKHZhbD86IHN0cmluZyB8IG51bGwpID0+IHZvaWQpOiB2b2lkIHtcbiAgICB0aGlzLl9vbkNoYW5nZSA9IG9uQ2hhbmdlO1xuICB9XG5cbiAgcHVibGljIHJlZ2lzdGVyT25Ub3VjaGVkKGZuOiAoKSA9PiB2b2lkKTogdm9pZCB7XG4gICAgdGhpcy5fb25Ub3VjaGVkID0gZm47XG4gIH1cblxuICBwdWJsaWMgc2V0RGlzYWJsZWRTdGF0ZShpc0Rpc2FibGVkOiBib29sZWFuKTogdm9pZCB7XG4gICAgdGhpcy5fZGlzYWJsZWQgPSBpc0Rpc2FibGVkO1xuICB9XG4gIC8vIC9Db250cm9sVmFsdWVBY2Nlc3NvclxuXG4gIC8qKiBNYXJrcyB0aGUgY29tcG9uZW50IGFzIHRvdWNoZWQgKi9cbiAgcHVibGljIG1hcmtBc1RvdWNoZWQoKSB7XG4gICAgaWYgKCF0aGlzLl90b3VjaGVkKSB7XG4gICAgICB0aGlzLl9vblRvdWNoZWQoKTtcbiAgICAgIHRoaXMuX3RvdWNoZWQgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBlbWl0Q2hhbmdlKHZhbHVlPzogc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZCkge1xuICAgIHRoaXMubWFya0FzVG91Y2hlZCgpO1xuXG4gICAgaWYgKCF0aGlzLl9kaXNhYmxlZCkge1xuICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgdGhpcy5fb25DaGFuZ2UodGhpcy52YWx1ZSk7XG4gICAgICB0aGlzLnZhbHVlQ2hhbmdlLmVtaXQodmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgdGhpcy5fa2V5TWFuYWdlciA9IG5ldyBGb2N1c0tleU1hbmFnZXIodGhpcy5jb2xvckl0ZW1zKVxuICAgICAgLndpdGhIb21lQW5kRW5kKClcbiAgICAgIC53aXRoSG9yaXpvbnRhbE9yaWVudGF0aW9uKCdsdHInKVxuICAgICAgLnNraXBQcmVkaWNhdGUoKCkgPT4gdGhpcy5kaXNhYmxlZClcbiAgICAgIC53aXRoV3JhcCgpO1xuXG4gICAgLy8gU2V0IHRoZSBpbml0aWFsIGZvY3VzLlxuICAgIHRoaXMuX3Jlc2V0QWN0aXZlT3B0aW9uKCk7XG5cbiAgICAvLyBNb3ZlIHRoZSB0YWJpbmRleCB0byB0aGUgY3VycmVudGx5LWZvY3VzZWQgbGlzdCBpdGVtLlxuICAgIC8vIHRoaXMuX2tleU1hbmFnZXIuY2hhbmdlLnN1YnNjcmliZSgoYWN0aXZlSXRlbUluZGV4KSA9PiB7XG4gICAgLy8gdGhpcy5fc2V0QWN0aXZlT3B0aW9uKGFjdGl2ZUl0ZW1JbmRleCk7XG4gICAgLy8gfSk7XG5cbiAgICAvLyBJZiB0aGUgYWN0aXZlIGl0ZW0gaXMgcmVtb3ZlZCBmcm9tIHRoZSBsaXN0LCByZXNldCBiYWNrIHRvIHRoZSBmaXJzdCBvbmUuXG4gICAgdGhpcy5jb2xvckl0ZW1zLmNoYW5nZXMucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkKSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIGNvbnN0IGFjdGl2ZUl0ZW0gPSB0aGlzLl9rZXlNYW5hZ2VyLmFjdGl2ZUl0ZW07XG5cbiAgICAgIGlmICghYWN0aXZlSXRlbSB8fCB0aGlzLmNvbG9ySXRlbXMudG9BcnJheSgpLmluZGV4T2YoYWN0aXZlSXRlbSkgPT09IC0xKSB7XG4gICAgICAgIHRoaXMuX3Jlc2V0QWN0aXZlT3B0aW9uKCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBUaGVzZSBldmVudHMgYXJlIGJvdW5kIG91dHNpZGUgdGhlIHpvbmUsIGJlY2F1c2UgdGhleSBkb24ndCBjaGFuZ2VcbiAgICAvLyBhbnkgY2hhbmdlLWRldGVjdGVkIHByb3BlcnRpZXMgYW5kIHRoZXkgY2FuIHRyaWdnZXIgdGltZW91dHMuXG4gICAgdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgIHRoaXMuX2VsLm5hdGl2ZUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignZm9jdXNpbicsIHRoaXMuX2hhbmRsZUZvY3VzaW4pO1xuICAgICAgdGhpcy5fZWwubmF0aXZlRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdmb2N1c291dCcsIHRoaXMuX2hhbmRsZUZvY3Vzb3V0KTtcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9rZXlNYW5hZ2VyLmRlc3Ryb3koKTtcbiAgICB0aGlzLl9lbC5uYXRpdmVFbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2ZvY3VzaW4nLCB0aGlzLl9oYW5kbGVGb2N1c2luKTtcbiAgICB0aGlzLl9lbC5uYXRpdmVFbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXG4gICAgICAnZm9jdXNvdXQnLFxuICAgICAgdGhpcy5faGFuZGxlRm9jdXNvdXRcbiAgICApO1xuXG4gICAgdGhpcy5fZGVzdHJveWVkLm5leHQoKTtcbiAgICB0aGlzLl9kZXN0cm95ZWQuY29tcGxldGUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAdG9kb1xuICAgKiBUaGUgbG9naWMgdG8gZGVjaWRlIGhvdyB0byBuYXZpZ2F0ZSBpbnNpZGUgdGhlIGdyaWQgd2hlbiB0aGVcbiAgICogdXAsIGRvd24sIGxlZnQgYW5kIHJpZ2h0IGJ1dHRvbnMgYXJlIHByZXNzZWRcbiAgICovXG4gIEBIb3N0TGlzdGVuZXIoJ2tleWRvd24nLCBbJyRldmVudCddKVxuICBwcml2YXRlIF9vbktleWRvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICBjb25zdCBpbmRleCA9IHRoaXMuX2tleU1hbmFnZXIuYWN0aXZlSXRlbUluZGV4XG4gICAgbGV0IG5leHRJbmRleCA9IGluZGV4IHx8IDA7XG4gICAgaWYgKGluZGV4KSB7XG4gICAgICBzd2l0Y2ggKGV2ZW50LmtleUNvZGUpIHtcbiAgICAgICAgY2FzZSBVUF9BUlJPVzpcbiAgICAgICAgICBuZXh0SW5kZXggPSBpbmRleCAtIE1hdGguZmxvb3IodGhpcy5faXRlbXNQZXJSb3cpO1xuICAgICAgICAgIG5leHRJbmRleCA9IHRoaXMuc2FuaXRpemVJbmRleChuZXh0SW5kZXgsIGluZGV4KVxuICAgICAgICAgIHRoaXMuX2tleU1hbmFnZXIuc2V0QWN0aXZlSXRlbShuZXh0SW5kZXgpOyBicmVhaztcbiAgICAgICAgY2FzZSBET1dOX0FSUk9XOlxuICAgICAgICAgIG5leHRJbmRleCA9IGluZGV4ICsgTWF0aC5mbG9vcih0aGlzLl9pdGVtc1BlclJvdyk7XG4gICAgICAgICAgbmV4dEluZGV4ID0gdGhpcy5zYW5pdGl6ZUluZGV4KG5leHRJbmRleCwgaW5kZXgpXG4gICAgICAgICAgdGhpcy5fa2V5TWFuYWdlci5zZXRBY3RpdmVJdGVtKG5leHRJbmRleCk7IGJyZWFrO1xuICAgICAgICBjYXNlIExFRlRfQVJST1c6XG4gICAgICAgIGNhc2UgUklHSFRfQVJST1c6IFxuICAgICAgICB0aGlzLl9rZXlNYW5hZ2VyLm9uS2V5ZG93bihldmVudCk7IGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHNhbml0aXplSW5kZXgobmV4dEluZGV4IDogbnVtYmVyLCBwcmV2SW5kZXg6IG51bWJlcikge1xuICAgIG5leHRJbmRleCA9IG5leHRJbmRleCA8IDAgPyBwcmV2SW5kZXggOiBuZXh0SW5kZXg7XG4gICAgbmV4dEluZGV4ID0gbmV4dEluZGV4ID49IHRoaXMuaXRlbXMubGVuZ3RoID8gcHJldkluZGV4IDogbmV4dEluZGV4O1xuICAgIHJldHVybiBuZXh0SW5kZXg7XG4gIH1cblxuICAvKiogSGFuZGxlcyBmb2N1c291dCBldmVudHMgd2l0aGluIHRoZSBsaXN0LiAqL1xuICBwcml2YXRlIF9oYW5kbGVGb2N1c291dCA9ICgpID0+IHtcbiAgICAvLyBGb2N1cyB0YWtlcyBhIHdoaWxlIHRvIHVwZGF0ZSBzbyB3ZSBoYXZlIHRvIHdyYXAgb3VyIGNhbGwgaW4gYSB0aW1lb3V0LlxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgaWYgKCF0aGlzLl9jb250YWluc0ZvY3VzKCkpIHtcbiAgICAgICAgdGhpcy5fcmVzZXRBY3RpdmVPcHRpb24oKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxuICAvKiogSGFuZGxlcyBmb2N1c2luIGV2ZW50cyB3aXRoaW4gdGhlIGxpc3QuICovXG4gIHByaXZhdGUgX2hhbmRsZUZvY3VzaW4gPSAoZXZlbnQ6IEZvY3VzRXZlbnQpID0+IHtcbiAgICBpZiAodGhpcy5kaXNhYmxlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGFjdGl2ZUluZGV4ID0gdGhpcy5jb2xvckl0ZW1zXG4gICAgICAudG9BcnJheSgpXG4gICAgICAuZmluZEluZGV4KChpdGVtKSA9PlxuICAgICAgICBpdGVtLmVsUmVmLm5hdGl2ZUVsZW1lbnQuY29udGFpbnMoZXZlbnQudGFyZ2V0IGFzIEhUTUxFbGVtZW50KVxuICAgICAgKTtcblxuICAgIGlmIChhY3RpdmVJbmRleCA+IC0xKSB7XG4gICAgICB0aGlzLl9zZXRBY3RpdmVPcHRpb24oYWN0aXZlSW5kZXgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9yZXNldEFjdGl2ZU9wdGlvbigpO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogU2V0cyBhbiBvcHRpb24gYXMgYWN0aXZlLlxuICAgKiBAcGFyYW0gaW5kZXggSW5kZXggb2YgdGhlIGFjdGl2ZSBvcHRpb24uIElmIHNldCB0byAtMSwgbm8gb3B0aW9uIHdpbGwgYmUgYWN0aXZlLlxuICAgKi9cbiAgcHJpdmF0ZSBfc2V0QWN0aXZlT3B0aW9uKGluZGV4OiBudW1iZXIpIHtcbiAgICB0aGlzLmNvbG9ySXRlbXMuZm9yRWFjaCgoaXRlbSwgaXRlbUluZGV4KSA9PlxuICAgICAgaXRlbS5zZXRUYWJpbmRleChpdGVtSW5kZXggPT09IGluZGV4ID8gMCA6IC0xKVxuICAgICk7XG5cbiAgICB0aGlzLl9rZXlNYW5hZ2VyLnVwZGF0ZUFjdGl2ZUl0ZW0oaW5kZXgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlc2V0cyB0aGUgYWN0aXZlIG9wdGlvbi4gV2hlbiB0aGUgbGlzdCBpcyBkaXNhYmxlZCwgcmVtb3ZlIGFsbCBvcHRpb25zIGZyb20gdG8gdGhlIHRhYiBvcmRlci5cbiAgICogT3RoZXJ3aXNlLCBmb2N1cyB0aGUgZmlyc3Qgc2VsZWN0ZWQgb3B0aW9uLlxuICAgKi9cbiAgcHJpdmF0ZSBfcmVzZXRBY3RpdmVPcHRpb24oKSB7XG4gICAgaWYgKHRoaXMuZGlzYWJsZWQpIHtcbiAgICAgIHRoaXMuX3NldEFjdGl2ZU9wdGlvbigtMSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgYWN0aXZlSXRlbSA9XG4gICAgICB0aGlzLmNvbG9ySXRlbXMuZmluZCgoaXRlbSkgPT4gaXRlbS5jaGVja2VkICYmICFpdGVtLmRpc2FibGVkKSB8fFxuICAgICAgdGhpcy5jb2xvckl0ZW1zLmZpcnN0O1xuXG4gICAgY29uc3QgaW5kZXggPSBhY3RpdmVJdGVtXG4gICAgICA/IHRoaXMuY29sb3JJdGVtcy50b0FycmF5KCkuaW5kZXhPZihhY3RpdmVJdGVtKVxuICAgICAgOiAtMTtcblxuICAgIHRoaXMuX3NldEFjdGl2ZU9wdGlvbihpbmRleCk7XG4gIH1cblxuICAvKiogUmV0dXJucyB3aGV0aGVyIHRoZSBmb2N1cyBpcyBjdXJyZW50bHkgd2l0aGluIHRoZSBsaXN0LiAqL1xuICBwcml2YXRlIF9jb250YWluc0ZvY3VzKCkge1xuICAgIGNvbnN0IGFjdGl2ZUVsZW1lbnQgPSBfZ2V0Rm9jdXNlZEVsZW1lbnRQaWVyY2VTaGFkb3dEb20oKTtcbiAgICByZXR1cm4gYWN0aXZlRWxlbWVudCAmJiB0aGlzLl9lbC5uYXRpdmVFbGVtZW50LmNvbnRhaW5zKGFjdGl2ZUVsZW1lbnQpO1xuICB9XG5cbiAgcHJpdmF0ZSBfdXBkYXRlS2V5TWFuYWdlckFjdGl2ZUl0ZW0oKSB7XG4gICAgY29uc3QgaW5kZXggPSB0aGlzLml0ZW1zLmZpbmRJbmRleCgoaXRlbSkgPT4gaXRlbSA9PSB0aGlzLnZhbHVlKVxuICAgIHRoaXMuX3NldEFjdGl2ZU9wdGlvbihpbmRleCk7XG4gIH1cbn1cbiIsIjxkaXYgcm9sZT1cImRpYWxvZ1wiPkNvbG9yIG9wdGlvbnM6PC9kaXY+XG5AZm9yKHJvdyBvZiBncmlkKCk7IHRyYWNrICRpbmRleCkge1xuPGRpdiBpZD1cImNvbG9yLWdyaWRcIiBjbGFzcz1cImZsZXhcIj5cbiAgQGZvciAoaXRlbSBvZiByb3c7IHRyYWNrIGl0ZW0pIHtcbiAgPGJyZXctY29sb3ItZ3JpZC1pdGVtXG4gICAgcm9sZT1cIm9wdGlvblwiXG4gICAgW2F0dHIuYXJpYS1zZWxlY3RlZF09XCJ2YWx1ZSA9PT0gaXRlbSA/ICd0cnVlJyA6ICdmYWxzZSdcIlxuICAgIFthdHRyLmFyaWEtZGlzYWJsZWRdPVwiZGlzYWJsZWQgPyAndHJ1ZScgOiAnZmFsc2UnXCJcbiAgICBbYXR0ci5hcmlhLWxhYmVsXSA9IFwidmFsdWVcIlxuICAgIFtjaGVja2VkXT1cInZhbHVlID09PSBpdGVtXCJcbiAgICBbdmFsdWVdPVwiaXRlbVwiXG4gICAgW3NpemVdPVwiaXRlbVNpemVcIlxuICAgIFtkaXNhYmxlZF09XCJkaXNhYmxlZFwiXG4gIC8+XG4gIH1cbjwvZGl2PlxufVxuIl19