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
import Color from 'color';

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
  public readonly form = this._fb.group({
    search: this._fb.control(''),
    color: this._fb.control(COLOR_GRID_ITEMS[0], {
      validators: [Validators.required],
    }),
  });

  public inputChanged() {
    const val = this.form.controls.search.value
    const color = Color(val || '')
    if (color) {
      this.form.controls.color.setValue(val)
    }
  }

}
