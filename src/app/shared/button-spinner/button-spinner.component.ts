import { Component, Input } from '@angular/core';
import { ThemePalette } from '@angular/material/core';

@Component({
  selector: 'app-button-spinner',
  templateUrl: './button-spinner.component.html',
  styleUrls: ['./button-spinner.component.scss'],
})
export class ButtonSpinnerComponent {
  @Input() busy = false;
  @Input() color: ThemePalette = 'accent';
}
