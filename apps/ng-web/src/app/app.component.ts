import { JsonPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import {
  COLOR_GRID_ITEMS,
  ColorGridSelectComponent,
} from '@brew/ng/ui/components';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  standalone: true,
  imports: [
    ReactiveFormsModule,
    JsonPipe,

    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,

    ColorGridSelectComponent,
  ],
  selector: 'brew-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private readonly _fb = inject(FormBuilder);
  _items = COLOR_GRID_ITEMS;
  
  public readonly form = this._fb.group({
    search: this._fb.control('rgb(255,105,180)'),
    color: this._fb.control(COLOR_GRID_ITEMS[2], {
      validators: [Validators.required],
    }),
  });

  public inputChanged() {
    const isPresent = this._items.find(c => c == this.form.controls.search.value)
    if (!isPresent) {
      this._items.push(this.form.controls.search.value || '')
    }
  }

}
