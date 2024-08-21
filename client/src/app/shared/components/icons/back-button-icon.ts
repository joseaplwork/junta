import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-back-button-icon',
  template: `
    <svg
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
      [attr.width]="size"
      [attr.height]="size"
      style="display:inline-block">
      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        stroke-linecap="round"
        stroke-linejoin="round"></g>
      <g id="SVGRepo_iconCarrier">
        <defs>
          <style>
            .cls-1 {
              fill: none;
              stroke-linecap: round;
              stroke-linejoin: round;
              stroke-width: 20px;
            }
          </style>
        </defs>
        <g data-name="Layer 2" id="Layer_2">
          <g
            data-name="E421, Back, buttons, multimedia, play, stop"
            id="E421_Back_buttons_multimedia_play_stop">
            <circle
              class="cls-1"
              [attr.stroke]="color"
              cx="256"
              cy="256"
              r="246"></circle>
            <line
              class="cls-1"
              x1="352.26"
              x2="170.43"
              y1="256"
              y2="256"
              [attr.stroke]="color"></line>
            <polyline
              class="cls-1"
              [attr.stroke]="color"
              points="223.91 202.52 170.44 256 223.91 309.48"></polyline>
          </g>
        </g>
      </g>
    </svg>
  `,
})
export class BackButtonIconComponent {
  @Input() size: number = 20;

  @Input() color: 'white' | 'black' = 'white';
}
