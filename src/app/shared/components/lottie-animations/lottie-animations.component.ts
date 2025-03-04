import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { AnimationOptions, LottieComponent } from 'ngx-lottie';

@Component({
  selector: 'app-lottie-animations',
  imports: [CommonModule, LottieComponent],
  templateUrl: './lottie-animations.component.html',
  styleUrl: './lottie-animations.component.scss'
})
export class LottieAnimationsComponent {

  isBrowser!: boolean;


  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  options: AnimationOptions = {
    path: 'assets/images/ramadan.json', // Adjust to your Lottie file path
  };

}
