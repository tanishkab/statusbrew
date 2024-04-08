import Color from 'color';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, HostBinding, HostListener, InjectionToken, Input, booleanAttribute, inject, } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
function ColorGridItemComponent_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "div", 3);
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵstyleProp("background-color", ctx_r0.colorContrast);
} }
const _c0 = (a0, a1, a2) => ({ "size-8 text-xs": a0, "size-16 text-xl": a1, "size-20 text-2xl": a2 });
export const COLOR_GRID_ITEMS = [
    'rgb(255, 0, 0)', // Red
    'rgb(0, 255, 0)', // Lime
    'rgb(0, 0, 255)', // Blue
    'rgb(255, 255, 0)', // Yellow
    'rgb(0, 255, 255)', // Cyan
    'rgb(255, 0, 255)', // Magenta
    'rgb(192, 192, 192)', // Silver
    'rgb(128, 128, 128)', // Gray
    'rgb(128, 0, 0)', // Maroon
    'rgb(128, 128, 0)', // Olive
    'rgb(0, 128, 0)', // Green
    'rgb(128, 0, 128)', // Purple
    'rgb(0, 128, 128)', // Teal
    'rgb(0, 0, 128)', // Navy
    'rgb(255, 165, 0)', // Orange
    'rgb(255, 105, 180)', // Hot Pink
    'rgb(75, 0, 130)', // Indigo
    'rgb(240, 128, 128)', // Light Coral
    'rgb(32, 178, 170)', // Light Sea Green
    'rgb(255, 222, 173)', // Navajo White
];
export const COLOR_GRID_ITEM_SIZES = ['small', 'medium', 'large'];
export const getContrastColor = (color) => Color(color).isDark() ? 'rgb(255,255,255)' : 'rgb(0,0,0)';
/**
 * Injection token that can be used to inject instances of `ColorGridSelectComponent`. It serves as
 * alternative token to the actual `ColorGridSelectComponent` class which could cause unnecessary
 * retention of the class and its component metadata.
 */
export const COLOR_GRID_SELECT = new InjectionToken('ColorGridSelect');
let nextUniqueId = 0;
export class ColorGridItemComponent {
    constructor() {
        this._uniqueId = `brew-color-grid-item-${++nextUniqueId}`;
        /** Whether this item is disabled. */
        this._disabled = false;
        this._colorGridSelect = inject(COLOR_GRID_SELECT, {
            optional: true,
        });
        this._changeDetector = inject(ChangeDetectorRef);
        /** The unique ID for the radio button. */
        this.id = this._uniqueId;
        this.size = COLOR_GRID_ITEM_SIZES[0];
        this.checked = false;
        this.elRef = inject(ElementRef);
        this.active = false;
    }
    get _role() {
        return 'option';
    }
    get value() {
        return this._value;
    }
    set value(value) {
        this._value = value;
        if (this._value) {
            this.colorContrast = getContrastColor(this._value);
        }
    }
    /** Whether the radio button is disabled. */
    get disabled() {
        return this._disabled;
    }
    set disabled(value) {
        this._setDisabled(value);
    }
    /** ID of the native input element inside `<brew-color-grid-item>` */
    get inputId() {
        return `${this.id || this._uniqueId}-input`;
    }
    setActiveStyles() {
        this.active = true;
    }
    setInactiveStyles() {
        this.active = false;
    }
    focus() {
        this.elRef.nativeElement.focus();
        this._toggleOnInteraction();
    }
    /** Sets the tabindex of the list option. */
    setTabindex(value) {
        this.elRef.nativeElement.setAttribute('tabindex', value + '');
    }
    /** Sets the disabled state and marks for check if a change occurred. */
    _setDisabled(value) {
        if (this._disabled !== value) {
            this._disabled = value;
            this._changeDetector.markForCheck();
        }
    }
    _toggleOnInteraction() {
        if (!this.disabled) {
            if (!this.checked) {
                this.checked = true;
                this._colorGridSelect?.emitChange(this.value);
            }
        }
    }
    static { this.ɵfac = function ColorGridItemComponent_Factory(t) { return new (t || ColorGridItemComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: ColorGridItemComponent, selectors: [["brew-color-grid-item"]], hostVars: 5, hostBindings: function ColorGridItemComponent_HostBindings(rf, ctx) { if (rf & 1) {
            i0.ɵɵlistener("click", function ColorGridItemComponent_click_HostBindingHandler() { return ctx._toggleOnInteraction(); });
        } if (rf & 2) {
            i0.ɵɵhostProperty("role", ctx._role);
            i0.ɵɵattribute("id", ctx.id)("aria-selected", ctx.checked);
            i0.ɵɵclassProp("active", ctx.active);
        } }, inputs: { id: "id", name: "name", value: "value", size: "size", checked: [i0.ɵɵInputFlags.HasDecoratorInputTransform, "checked", "checked", booleanAttribute], disabled: [i0.ɵɵInputFlags.HasDecoratorInputTransform, "disabled", "disabled", booleanAttribute] }, standalone: true, features: [i0.ɵɵInputTransformsFeature, i0.ɵɵStandaloneFeature], decls: 3, vars: 8, consts: [[1, "p-0.5", 3, "ngClass"], [1, "flex", "rounded-full", "justify-center", "items-center", "size-full"], ["class", "size-1/2 rounded-full", 3, "background-color"], [1, "size-1/2", "rounded-full"]], template: function ColorGridItemComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 0)(1, "div", 1);
            i0.ɵɵtemplate(2, ColorGridItemComponent_Conditional_2_Template, 1, 2, "div", 2);
            i0.ɵɵelementEnd()();
        } if (rf & 2) {
            i0.ɵɵproperty("ngClass", i0.ɵɵpureFunction3(4, _c0, ctx.size === "small", ctx.size === "medium", ctx.size === "large"));
            i0.ɵɵadvance();
            i0.ɵɵstyleProp("background-color", ctx.value);
            i0.ɵɵadvance();
            i0.ɵɵconditional(2, ctx.checked ? 2 : -1);
        } }, dependencies: [CommonModule, i1.NgClass], styles: ["[_nghost-%COMP%]{border-radius:9999px}[_nghost-%COMP%]:not([disabled]){cursor:pointer}[_nghost-%COMP%]:focus, .active[_nghost-%COMP%]{background-color:rgb(96 165 250 / var(--tw-bg-opacity));--tw-bg-opacity: .8;outline:2px solid transparent;outline-offset:2px}"], changeDetection: 0 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(ColorGridItemComponent, [{
        type: Component,
        args: [{ selector: 'brew-color-grid-item', standalone: true, imports: [CommonModule], changeDetection: ChangeDetectionStrategy.OnPush, template: "<div\n  class=\"p-0.5\"\n  [ngClass]=\"{\n    'size-8 text-xs': size === 'small',\n    'size-16 text-xl': size === 'medium',\n    'size-20 text-2xl': size === 'large'\n  }\"\n>\n  <div\n    class=\"flex rounded-full justify-center items-center size-full\"\n    [style.background-color]=\"value\"\n  >\n    @if(checked) {\n    <div\n      class=\"size-1/2 rounded-full\"\n      [style.background-color]=\"colorContrast\"\n    ></div>\n    }\n  </div>\n</div>\n", styles: [":host{border-radius:9999px}:host:not([disabled]){cursor:pointer}:host:focus,:host.active{background-color:rgb(96 165 250 / var(--tw-bg-opacity));--tw-bg-opacity: .8;outline:2px solid transparent;outline-offset:2px}\n"] }]
    }], null, { _role: [{
            type: HostBinding,
            args: ['role']
        }], id: [{
            type: HostBinding,
            args: ['attr.id']
        }, {
            type: Input
        }], name: [{
            type: Input
        }], value: [{
            type: Input
        }], size: [{
            type: Input
        }], checked: [{
            type: HostBinding,
            args: ['attr.aria-selected']
        }, {
            type: Input,
            args: [{ transform: booleanAttribute }]
        }], disabled: [{
            type: Input,
            args: [{ transform: booleanAttribute }]
        }], active: [{
            type: HostBinding,
            args: ['class.active']
        }], _toggleOnInteraction: [{
            type: HostListener,
            args: ['click']
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(ColorGridItemComponent, { className: "ColorGridItemComponent", filePath: "lib\\color-grid-select\\item\\item.component.ts", lineNumber: 71 }); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXRlbS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9saWJzL25nL3VpL2NvbXBvbmVudHMvc3JjL2xpYi9jb2xvci1ncmlkLXNlbGVjdC9pdGVtL2l0ZW0uY29tcG9uZW50LnRzIiwiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vbGlicy9uZy91aS9jb21wb25lbnRzL3NyYy9saWIvY29sb3ItZ3JpZC1zZWxlY3QvaXRlbS9pdGVtLmNvbXBvbmVudC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sS0FBSyxNQUFNLE9BQU8sQ0FBQztBQUMxQixPQUFPLEVBQ0wsdUJBQXVCLEVBQ3ZCLGlCQUFpQixFQUNqQixTQUFTLEVBQ1QsVUFBVSxFQUNWLFdBQVcsRUFDWCxZQUFZLEVBQ1osY0FBYyxFQUNkLEtBQUssRUFDTCxnQkFBZ0IsRUFDaEIsTUFBTSxHQUNQLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQzs7OztJQ0EzQyx5QkFHTzs7O0lBREwsd0RBQXdDOzs7QURFOUMsTUFBTSxDQUFDLE1BQU0sZ0JBQWdCLEdBQUc7SUFDOUIsZ0JBQWdCLEVBQUUsTUFBTTtJQUN4QixnQkFBZ0IsRUFBRSxPQUFPO0lBQ3pCLGdCQUFnQixFQUFFLE9BQU87SUFDekIsa0JBQWtCLEVBQUUsU0FBUztJQUM3QixrQkFBa0IsRUFBRSxPQUFPO0lBQzNCLGtCQUFrQixFQUFFLFVBQVU7SUFDOUIsb0JBQW9CLEVBQUUsU0FBUztJQUMvQixvQkFBb0IsRUFBRSxPQUFPO0lBQzdCLGdCQUFnQixFQUFFLFNBQVM7SUFDM0Isa0JBQWtCLEVBQUUsUUFBUTtJQUM1QixnQkFBZ0IsRUFBRSxRQUFRO0lBQzFCLGtCQUFrQixFQUFFLFNBQVM7SUFDN0Isa0JBQWtCLEVBQUUsT0FBTztJQUMzQixnQkFBZ0IsRUFBRSxPQUFPO0lBQ3pCLGtC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LEVBQUUsU0FBUyxFQUFFLGdCQUFnQixFQUFFO1lBa0IvQixNQUFNO2tCQURaLFdBQVc7bUJBQUMsY0FBYztZQThCbkIsb0JBQW9CO2tCQUQzQixZQUFZO21CQUFDLE9BQU87O2tGQTVGVixzQkFBc0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQ29sb3IgZnJvbSAnY29sb3InO1xuaW1wb3J0IHtcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIEVsZW1lbnRSZWYsXG4gIEhvc3RCaW5kaW5nLFxuICBIb3N0TGlzdGVuZXIsXG4gIEluamVjdGlvblRva2VuLFxuICBJbnB1dCxcbiAgYm9vbGVhbkF0dHJpYnV0ZSxcbiAgaW5qZWN0LFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5cbmltcG9ydCB7IEZvY3VzYWJsZU9wdGlvbiwgSGlnaGxpZ2h0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9hMTF5JztcblxuZXhwb3J0IGNvbnN0IENPTE9SX0dSSURfSVRFTVMgPSBbXG4gICdyZ2IoMjU1LCAwLCAwKScsIC8vIFJlZFxuICAncmdiKDAsIDI1NSwgMCknLCAvLyBMaW1lXG4gICdyZ2IoMCwgMCwgMjU1KScsIC8vIEJsdWVcbiAgJ3JnYigyNTUsIDI1NSwgMCknLCAvLyBZZWxsb3dcbiAgJ3JnYigwLCAyNTUsIDI1NSknLCAvLyBDeWFuXG4gICdyZ2IoMjU1LCAwLCAyNTUpJywgLy8gTWFnZW50YVxuICAncmdiKDE5MiwgMTkyLCAxOTIpJywgLy8gU2lsdmVyXG4gICdyZ2IoMTI4LCAxMjgsIDEyOCknLCAvLyBHcmF5XG4gICdyZ2IoMTI4LCAwLCAwKScsIC8vIE1hcm9vblxuICAncmdiKDEyOCwgMTI4LCAwKScsIC8vIE9saXZlXG4gICdyZ2IoMCwgMTI4LCAwKScsIC8vIEdyZWVuXG4gICdyZ2IoMTI4LCAwLCAxMjgpJywgLy8gUHVycGxlXG4gICdyZ2IoMCwgMTI4LCAxMjgpJywgLy8gVGVhbFxuICAncmdiKDAsIDAsIDEyOCknLCAvLyBOYXZ5XG4gICdyZ2IoMjU1LCAxNjUsIDApJywgLy8gT3JhbmdlXG4gICdyZ2IoMjU1LCAxMDUsIDE4MCknLCAvLyBIb3QgUGlua1xuICAncmdiKDc1LCAwLCAxMzApJywgLy8gSW5kaWdvXG4gICdyZ2IoMjQwLCAxMjgsIDEyOCknLCAvLyBMaWdodCBDb3JhbFxuICAncmdiKDMyLCAxNzgsIDE3MCknLCAvLyBMaWdodCBTZWEgR3JlZW5cbiAgJ3JnYigyNTUsIDIyMiwgMTczKScsIC8vIE5hdmFqbyBXaGl0ZVxuXTtcblxuZXhwb3J0IGNvbnN0IENPTE9SX0dSSURfSVRFTV9TSVpFUyA9IFsnc21hbGwnLCAnbWVkaXVtJywgJ2xhcmdlJ10gYXMgY29uc3Q7XG5cbmV4cG9ydCBjb25zdCBnZXRDb250cmFzdENvbG9yID0gKGNvbG9yOiBDb2xvciB8IHN0cmluZykgPT5cbiAgQ29sb3IoY29sb3IpLmlzRGFyaygpID8gJ3JnYigyNTUsMjU1LDI1NSknIDogJ3JnYigwLDAsMCknO1xuXG5leHBvcnQgdHlwZSBDb2xvckdyaWRJdGVtU2l6ZSA9ICh0eXBlb2YgQ09MT1JfR1JJRF9JVEVNX1NJWkVTKVtudW1iZXJdO1xuXG5leHBvcnQgdHlwZSBDb2xvckdyaWRTZWxlY3QgPSB7XG4gIHZhbHVlPzogc3RyaW5nIHwgbnVsbDtcbiAgZW1pdENoYW5nZTogKHZhbHVlPzogc3RyaW5nIHwgbnVsbCkgPT4gdm9pZDtcbn07XG4vKipcbiAqIEluamVjdGlvbiB0b2tlbiB0aGF0IGNhbiBiZSB1c2VkIHRvIGluamVjdCBpbnN0YW5jZXMgb2YgYENvbG9yR3JpZFNlbGVjdENvbXBvbmVudGAuIEl0IHNlcnZlcyBhc1xuICogYWx0ZXJuYXRpdmUgdG9rZW4gdG8gdGhlIGFjdHVhbCBgQ29sb3JHcmlkU2VsZWN0Q29tcG9uZW50YCBjbGFzcyB3aGljaCBjb3VsZCBjYXVzZSB1bm5lY2Vzc2FyeVxuICogcmV0ZW50aW9uIG9mIHRoZSBjbGFzcyBhbmQgaXRzIGNvbXBvbmVudCBtZXRhZGF0YS5cbiAqL1xuZXhwb3J0IGNvbnN0IENPTE9SX0dSSURfU0VMRUNUID0gbmV3IEluamVjdGlvblRva2VuPENvbG9yR3JpZFNlbGVjdD4oXG4gICdDb2xvckdyaWRTZWxlY3QnXG4pO1xuXG5sZXQgbmV4dFVuaXF1ZUlkID0gMDtcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYnJldy1jb2xvci1ncmlkLWl0ZW0nLFxuICBzdGFuZGFsb25lOiB0cnVlLFxuICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlXSxcbiAgdGVtcGxhdGVVcmw6ICcuL2l0ZW0uY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybDogJy4vaXRlbS5jb21wb25lbnQuc2NzcycsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxufSlcbmV4cG9ydCBjbGFzcyBDb2xvckdyaWRJdGVtQ29tcG9uZW50IGltcGxlbWVudHMgSGlnaGxpZ2h0YWJsZSwgRm9jdXNhYmxlT3B0aW9uIHtcbiAgcHJpdmF0ZSBfdW5pcXVlSWQgPSBgYnJldy1jb2xvci1ncmlkLWl0ZW0tJHsrK25leHRVbmlxdWVJZH1gO1xuXG4gIC8qKiBXaGV0aGVyIHRoaXMgaXRlbSBpcyBkaXNhYmxlZC4gKi9cbiAgcHJpdmF0ZSBfZGlzYWJsZWQgPSBmYWxzZTtcblxuICBwcml2YXRlIF92YWx1ZT86IHN0cmluZztcblxuICBwcml2YXRlIHJlYWRvbmx5IF9jb2xvckdyaWRTZWxlY3QgPSBpbmplY3QoQ09MT1JfR1JJRF9TRUxFQ1QsIHtcbiAgICBvcHRpb25hbDogdHJ1ZSxcbiAgfSk7XG4gIHByaXZhdGUgcmVhZG9ubHkgX2NoYW5nZURldGVjdG9yID0gaW5qZWN0KENoYW5nZURldGVjdG9yUmVmKTtcblxuICBASG9zdEJpbmRpbmcoJ3JvbGUnKVxuICBwcml2YXRlIGdldCBfcm9sZSgpIHtcbiAgICByZXR1cm4gJ29wdGlvbic7XG4gIH1cblxuICAvKiogVGhlIHVuaXF1ZSBJRCBmb3IgdGhlIHJhZGlvIGJ1dHRvbi4gKi9cbiAgQEhvc3RCaW5kaW5nKCdhdHRyLmlkJylcbiAgQElucHV0KClcbiAgcHVibGljIGlkOiBzdHJpbmcgPSB0aGlzLl91bmlxdWVJZDtcblxuICAvKiogQW5hbG9nIHRvIEhUTUwgJ25hbWUnIGF0dHJpYnV0ZSB1c2VkIHRvIGdyb3VwIHJhZGlvcyBmb3IgdW5pcXVlIHNlbGVjdGlvbi4gKi9cbiAgQElucHV0KCkgbmFtZSE6IHN0cmluZztcblxuICBASW5wdXQoKVxuICBwdWJsaWMgZ2V0IHZhbHVlKCkge1xuICAgIHJldHVybiB0aGlzLl92YWx1ZTtcbiAgfVxuXG4gIHB1YmxpYyBzZXQgdmFsdWUodmFsdWUpIHtcbiAgICB0aGlzLl92YWx1ZSA9IHZhbHVlO1xuICAgIGlmICh0aGlzLl92YWx1ZSkge1xuICAgICAgdGhpcy5jb2xvckNvbnRyYXN0ID0gZ2V0Q29udHJhc3RDb2xvcih0aGlzLl92YWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgQElucHV0KClcbiAgcHVibGljIHNpemU6IENvbG9yR3JpZEl0ZW1TaXplID0gQ09MT1JfR1JJRF9JVEVNX1NJWkVTWzBdO1xuXG4gIEBIb3N0QmluZGluZygnYXR0ci5hcmlhLXNlbGVjdGVkJylcbiAgQElucHV0KHsgdHJhbnNmb3JtOiBib29sZWFuQXR0cmlidXRlIH0pXG4gIHB1YmxpYyBjaGVja2VkID0gZmFsc2U7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHJhZGlvIGJ1dHRvbiBpcyBkaXNhYmxlZC4gKi9cbiAgQElucHV0KHsgdHJhbnNmb3JtOiBib29sZWFuQXR0cmlidXRlIH0pXG4gIGdldCBkaXNhYmxlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fZGlzYWJsZWQ7XG4gIH1cbiAgc2V0IGRpc2FibGVkKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fc2V0RGlzYWJsZWQodmFsdWUpO1xuICB9XG5cbiAgLyoqIElEIG9mIHRoZSBuYXRpdmUgaW5wdXQgZWxlbWVudCBpbnNpZGUgYDxicmV3LWNvbG9yLWdyaWQtaXRlbT5gICovXG4gIHB1YmxpYyBnZXQgaW5wdXRJZCgpOiBzdHJpbmcge1xuICAgIHJldHVybiBgJHt0aGlzLmlkIHx8IHRoaXMuX3VuaXF1ZUlkfS1pbnB1dGA7XG4gIH1cblxuICBwdWJsaWMgcmVhZG9ubHkgZWxSZWYgPSBpbmplY3QoRWxlbWVudFJlZik7XG5cbiAgcHVibGljIGNvbG9yQ29udHJhc3Q/OiBzdHJpbmc7XG5cbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy5hY3RpdmUnKVxuICBwdWJsaWMgYWN0aXZlID0gZmFsc2U7XG5cbiAgcHVibGljIHNldEFjdGl2ZVN0eWxlcygpOiB2b2lkIHtcbiAgICB0aGlzLmFjdGl2ZSA9IHRydWU7XG4gIH1cblxuICBwdWJsaWMgc2V0SW5hY3RpdmVTdHlsZXMoKTogdm9pZCB7XG4gICAgdGhpcy5hY3RpdmUgPSBmYWxzZTtcbiAgfVxuXG4gIHB1YmxpYyBmb2N1cygpIHtcbiAgICB0aGlzLmVsUmVmLm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgICB0aGlzLl90b2dnbGVPbkludGVyYWN0aW9uKCk7XG4gIH1cblxuICAvKiogU2V0cyB0aGUgdGFiaW5kZXggb2YgdGhlIGxpc3Qgb3B0aW9uLiAqL1xuICBwdWJsaWMgc2V0VGFiaW5kZXgodmFsdWU6IG51bWJlcikge1xuICAgIHRoaXMuZWxSZWYubmF0aXZlRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywgdmFsdWUgKyAnJyk7XG4gIH1cblxuICAvKiogU2V0cyB0aGUgZGlzYWJsZWQgc3RhdGUgYW5kIG1hcmtzIGZvciBjaGVjayBpZiBhIGNoYW5nZSBvY2N1cnJlZC4gKi9cbiAgcHJvdGVjdGVkIF9zZXREaXNhYmxlZCh2YWx1ZTogYm9vbGVhbikge1xuICAgIGlmICh0aGlzLl9kaXNhYmxlZCAhPT0gdmFsdWUpIHtcbiAgICAgIHRoaXMuX2Rpc2FibGVkID0gdmFsdWU7XG4gICAgICB0aGlzLl9jaGFuZ2VEZXRlY3Rvci5tYXJrRm9yQ2hlY2soKTtcbiAgICB9XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdjbGljaycpXG4gIHByaXZhdGUgX3RvZ2dsZU9uSW50ZXJhY3Rpb24oKSB7XG4gICAgaWYgKCF0aGlzLmRpc2FibGVkKSB7XG4gICAgICBpZiAoIXRoaXMuY2hlY2tlZCkge1xuICAgICAgICB0aGlzLmNoZWNrZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLl9jb2xvckdyaWRTZWxlY3Q/LmVtaXRDaGFuZ2UodGhpcy52YWx1ZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG4iLCI8ZGl2XG4gIGNsYXNzPVwicC0wLjVcIlxuICBbbmdDbGFzc109XCJ7XG4gICAgJ3NpemUtOCB0ZXh0LXhzJzogc2l6ZSA9PT0gJ3NtYWxsJyxcbiAgICAnc2l6ZS0xNiB0ZXh0LXhsJzogc2l6ZSA9PT0gJ21lZGl1bScsXG4gICAgJ3NpemUtMjAgdGV4dC0yeGwnOiBzaXplID09PSAnbGFyZ2UnXG4gIH1cIlxuPlxuICA8ZGl2XG4gICAgY2xhc3M9XCJmbGV4IHJvdW5kZWQtZnVsbCBqdXN0aWZ5LWNlbnRlciBpdGVtcy1jZW50ZXIgc2l6ZS1mdWxsXCJcbiAgICBbc3R5bGUuYmFja2dyb3VuZC1jb2xvcl09XCJ2YWx1ZVwiXG4gID5cbiAgICBAaWYoY2hlY2tlZCkge1xuICAgIDxkaXZcbiAgICAgIGNsYXNzPVwic2l6ZS0xLzIgcm91bmRlZC1mdWxsXCJcbiAgICAgIFtzdHlsZS5iYWNrZ3JvdW5kLWNvbG9yXT1cImNvbG9yQ29udHJhc3RcIlxuICAgID48L2Rpdj5cbiAgICB9XG4gIDwvZGl2PlxuPC9kaXY+XG4iXX0=